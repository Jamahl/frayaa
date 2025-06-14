"""
Google Refresh Token utilities for fetching tokens from Supabase
"""
import logging
from supabase import create_client, Client
from django.conf import settings

logger = logging.getLogger(__name__)

def get_user_google_refresh_token(user_id: str) -> str | None:
    """
    Fetch the Google refresh token for a user from Supabase users table
    
    Args:
        user_id: Supabase user ID
        
    Returns:
        Google refresh token string or None if not found
    """
    try:
        # Create Supabase client with service role key
        supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        
        # Fetch user's Google refresh token
        result = supabase.from_('users').select('google_refresh_token').eq('id', user_id).single().execute()
        
        if result.data and result.data.get('google_refresh_token'):
            logger.info(f"Successfully retrieved Google refresh token for user: {user_id}")
            return result.data['google_refresh_token']
        else:
            logger.warning(f"No Google refresh token found for user: {user_id}")
            return None
            
    except Exception as e:
        logger.error(f"Error fetching Google refresh token for user {user_id}: {str(e)}")
        return None

def get_all_users_with_google_tokens():
    """
    Fetch all users who have Google refresh tokens (for polling)
    
    Returns:
        List of user records with Google tokens
    """
    try:
        # Create Supabase client with service role key
        supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        
        # Fetch all users with Google refresh tokens
        result = supabase.from_('users').select('id, email, google_refresh_token').not_.is_('google_refresh_token', 'null').execute()
        
        if result.data:
            logger.info(f"Found {len(result.data)} users with Google refresh tokens")
            return result.data
        else:
            logger.info("No users found with Google refresh tokens")
            return []
            
    except Exception as e:
        logger.error(f"Error fetching users with Google tokens: {str(e)}")
        return []
