'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Submit a vote for a caption
 * @param captionId - The UUID of the caption being voted on
 * @param voteValue - 1 for upvote, -1 for downvote
 * @returns { success: boolean, error?: string }
 */
export async function submitVote(captionId: string, voteValue: 1 | -1) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'You must be logged in to vote' };
  }

  // Get the profile_id for the authenticated user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: 'Could not find user profile' };
  }

  // Check if user has already voted on this caption
  const { data: existingVote, error: checkError } = await supabase
    .from('caption_votes')
    .select('id, vote_value')
    .eq('caption_id', captionId)
    .eq('profile_id', profile.id)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking existing vote:', checkError);
    return { success: false, error: 'Error checking existing vote' };
  }

  // If user already voted with the same value, remove the vote (toggle off)
  if (existingVote && existingVote.vote_value === voteValue) {
    const { error: deleteError } = await supabase
      .from('caption_votes')
      .delete()
      .eq('id', existingVote.id);

    if (deleteError) {
      console.error('Error deleting vote:', deleteError);
      return { success: false, error: 'Failed to remove vote' };
    }

    revalidatePath('/captions');
    return { success: true };
  }

  // If user voted with different value, update the vote
  if (existingVote) {
    const { error: updateError } = await supabase
      .from('caption_votes')
      .update({ 
        vote_value: voteValue,
        modified_datetime_utc: new Date().toISOString()
      })
      .eq('id', existingVote.id);

    if (updateError) {
      console.error('Error updating vote:', updateError);
      return { success: false, error: 'Failed to update vote' };
    }

    revalidatePath('/captions');
    return { success: true };
  }

  // Insert new vote
  const { error: insertError } = await supabase
    .from('caption_votes')
    .insert({
      caption_id: captionId,
      profile_id: profile.id,
      vote_value: voteValue,
      created_datetime_utc: new Date().toISOString()
    });

  if (insertError) {
    console.error('Error inserting vote:', insertError);
    return { success: false, error: 'Failed to submit vote' };
  }

  revalidatePath('/captions');
  return { success: true };
}

/**
 * Get the current user's vote for a specific caption
 */
export async function getUserVote(captionId: string): Promise<number | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: vote } = await supabase
    .from('caption_votes')
    .select('vote_value')
    .eq('caption_id', captionId)
    .eq('profile_id', user.id)
    .maybeSingle();

  return vote?.vote_value ?? null;
}

type CaptionWithImage = {
  id: string;
  created_datetime_utc: string;
  content: string;
  is_public: boolean;
  profile_id: string;
  image_id: string;
  is_featured: boolean;
  like_count: number;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  images: {
    url: string | null;
    image_description: string | null;
  } | null;
  voteScore: number;
  userVote: number | null;
};

/**
 * Fetch a random public caption that the user hasn't voted on yet
 */
export async function getRandomUnvotedCaption(): Promise<{ 
  caption: CaptionWithImage | null; 
  error?: string 
}> {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { caption: null, error: 'You must be logged in' };
  }

  try {
    // Get all caption IDs the user has already voted on
    const { data: votedCaptions, error: votedError } = await supabase
      .from('caption_votes')
      .select('caption_id')
      .eq('profile_id', user.id);

    if (votedError) {
      console.error('Error fetching voted captions:', votedError);
    }

    const votedCaptionIds = new Set(votedCaptions?.map(v => v.caption_id) || []);

    // Fetch all public captions with left joins (use left join instead of inner)
    const { data, error } = await supabase
      .from('captions')
      .select(`
        id,
        created_datetime_utc,
        content,
        is_public,
        profile_id,
        image_id,
        is_featured,
        like_count,
        profiles (
          first_name,
          last_name,
          email
        ),
        images (
          url,
          image_description
        )
      `)
      .eq('is_public', true);

    if (error) {
      console.error('Error fetching captions:', error);
      return { caption: null, error: `Database error: ${error.message}` };
    }

    if (!data || data.length === 0) {
      return { 
        caption: null, 
        error: 'No public captions available. This might be due to Row Level Security policies restricting access.' 
      };
    }

    // Filter out captions the user has already voted on (client-side filtering)
    const unvotedCaptions = data.filter((caption: any) => !votedCaptionIds.has(caption.id));

    if (unvotedCaptions.length === 0) {
      return { caption: null, error: `You've voted on all ${data.length} available captions!` };
    }

    // Pick a random caption from unvoted ones
    const randomIndex = Math.floor(Math.random() * unvotedCaptions.length);
    const randomCaption = unvotedCaptions[randomIndex];

    // Transform the data
    const caption: any = {
      ...randomCaption,
      profiles: Array.isArray(randomCaption.profiles) 
        ? randomCaption.profiles[0] 
        : randomCaption.profiles,
      images: Array.isArray(randomCaption.images) 
        ? randomCaption.images[0] 
        : randomCaption.images
    };

    // Get vote score for this caption
    const { data: votes } = await supabase
      .from('caption_votes')
      .select('vote_value')
      .eq('caption_id', caption.id);

    const voteScore = votes?.reduce((sum, vote) => sum + vote.vote_value, 0) || 0;

    return {
      caption: {
        ...caption,
        voteScore,
        userVote: null
      }
    };
  } catch (error: any) {
    console.error('Error fetching random caption:', error);
    return { caption: null, error: 'Failed to fetch caption' };
  }
}

/**
 * Fetch a specific caption by ID with its vote data
 */
export async function getCaptionById(captionId: string): Promise<{
  caption: CaptionWithImage | null;
  error?: string;
}> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { caption: null, error: 'You must be logged in' };
  }

  try {
    const { data, error } = await supabase
      .from('captions')
      .select(`
        id,
        created_datetime_utc,
        content,
        is_public,
        profile_id,
        image_id,
        is_featured,
        like_count,
        profiles (
          first_name,
          last_name,
          email
        ),
        images (
          url,
          image_description
        )
      `)
      .eq('id', captionId)
      .single();

    if (error) throw error;

    // Transform the data
    const caption: any = {
      ...data,
      profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
      images: Array.isArray(data.images) ? data.images[0] : data.images
    };

    // Get vote score and user's vote
    const { data: votes } = await supabase
      .from('caption_votes')
      .select('vote_value, profile_id')
      .eq('caption_id', caption.id);

    const voteScore = votes?.reduce((sum, vote) => sum + vote.vote_value, 0) || 0;
    const userVote = votes?.find(v => v.profile_id === user.id)?.vote_value || null;

    return {
      caption: {
        ...caption,
        voteScore,
        userVote
      }
    };
  } catch (error: any) {
    console.error('Error fetching caption:', error);
    return { caption: null, error: 'Failed to fetch caption' };
  }
}

/**
 * Fetch user's voted caption history with pagination
 */
export async function getVotedCaptionHistory(page: number = 1, perPage: number = 20): Promise<{
  captions: CaptionWithImage[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  error?: string;
}> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { captions: [], totalCount: 0, currentPage: 1, totalPages: 0, error: 'You must be logged in' };
  }

  try {
    // Get all votes by this user with caption data
    const { data: votesData, error: votesError, count } = await supabase
      .from('caption_votes')
      .select(`
        vote_value,
        created_datetime_utc,
        caption_id,
        captions (
          id,
          content,
          is_public,
          profile_id,
          image_id,
          is_featured,
          like_count,
          created_datetime_utc,
          profiles (
            first_name,
            last_name,
            email
          ),
          images (
            url,
            image_description
          )
        )
      `, { count: 'exact' })
      .eq('profile_id', user.id)
      .order('created_datetime_utc', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (votesError) throw votesError;

    if (!votesData || votesData.length === 0) {
      return { 
        captions: [], 
        totalCount: 0, 
        currentPage: page, 
        totalPages: 0,
        error: 'You haven\'t voted on any captions yet!' 
      };
    }

    // Transform the data
    const captionsWithNull = await Promise.all(
      votesData.map(async (vote: any) => {
        const caption = Array.isArray(vote.captions) ? vote.captions[0] : vote.captions;
        
        if (!caption) return null;

        // Get total vote score for this caption
        const { data: allVotes } = await supabase
          .from('caption_votes')
          .select('vote_value')
          .eq('caption_id', caption.id);

        const voteScore = allVotes?.reduce((sum, v) => sum + v.vote_value, 0) || 0;

        return {
          id: caption.id,
          created_datetime_utc: caption.created_datetime_utc,
          content: caption.content,
          is_public: caption.is_public,
          profile_id: caption.profile_id,
          image_id: caption.image_id,
          is_featured: caption.is_featured,
          like_count: caption.like_count,
          profiles: Array.isArray(caption.profiles) ? caption.profiles[0] : caption.profiles,
          images: Array.isArray(caption.images) ? caption.images[0] : caption.images,
          voteScore,
          userVote: vote.vote_value
        };
      })
    );

    const validCaptions = captionsWithNull.filter((c): c is CaptionWithImage => c !== null);
    const totalPages = Math.ceil((count || 0) / perPage);

    return {
      captions: validCaptions,
      totalCount: count || 0,
      currentPage: page,
      totalPages
    };
  } catch (error: any) {
    console.error('Error fetching voted history:', error);
    return { 
      captions: [], 
      totalCount: 0, 
      currentPage: 1, 
      totalPages: 0,
      error: 'Failed to fetch voting history' 
    };
  }
}
