-- DurgasOS PostgreSQL Database Schema
-- This script creates all necessary tables for the DurgasOS application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DESKTOP MODULE
-- ============================================

-- Window States Table
-- Stores the state of windows/applications on the desktop
CREATE TABLE IF NOT EXISTS window_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    is_minimized BOOLEAN NOT NULL DEFAULT false,
    is_maximized BOOLEAN NOT NULL DEFAULT false,
    z_index INTEGER NOT NULL DEFAULT 0,
    position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
    size JSONB NOT NULL DEFAULT '{"width": 800, "height": 600}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID, -- Optional: for multi-user support
    CONSTRAINT window_states_position_check CHECK (position ? 'x' AND position ? 'y'),
    CONSTRAINT window_states_size_check CHECK (size ? 'width' AND size ? 'height')
);

-- Indexes for window_states
CREATE INDEX IF NOT EXISTS idx_window_states_app_id ON window_states(app_id);
CREATE INDEX IF NOT EXISTS idx_window_states_user_id ON window_states(user_id);
CREATE INDEX IF NOT EXISTS idx_window_states_is_open ON window_states(is_open);

-- ============================================
-- FILES MODULE
-- ============================================

-- File Items Table
-- Stores file and directory information
CREATE TABLE IF NOT EXISTS file_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'file' or 'directory'
    size BIGINT, -- File size in bytes (NULL for directories)
    date_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_id UUID REFERENCES file_items(id) ON DELETE CASCADE,
    user_id UUID, -- Optional: for multi-user support
    file_path TEXT, -- Full path to the file
    mime_type VARCHAR(255), -- MIME type for files
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT file_items_type_check CHECK (type IN ('file', 'directory')),
    CONSTRAINT file_items_size_check CHECK (type = 'directory' OR size IS NOT NULL)
);

-- Indexes for file_items
CREATE INDEX IF NOT EXISTS idx_file_items_parent_id ON file_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_file_items_user_id ON file_items(user_id);
CREATE INDEX IF NOT EXISTS idx_file_items_type ON file_items(type);
CREATE INDEX IF NOT EXISTS idx_file_items_name ON file_items(name);

-- ============================================
-- SETTINGS MODULE
-- ============================================

-- Settings Table
-- Stores application settings as key-value pairs
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value JSONB NOT NULL, -- Flexible JSON value to store any type
    description TEXT,
    category VARCHAR(100), -- Optional: group settings by category
    user_id UUID, -- Optional: for user-specific settings (NULL = global)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT settings_key_user_unique UNIQUE (key, user_id)
);

-- Indexes for settings
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- ============================================
-- NOTIFICATIONS MODULE
-- ============================================

-- Notifications Table
-- Stores notification records
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    app_name VARCHAR(255), -- Optional: which app generated the notification
    duration INTEGER DEFAULT 5000, -- Duration in milliseconds
    timestamp BIGINT NOT NULL, -- Unix timestamp in milliseconds
    user_id UUID, -- Optional: for multi-user support
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_timestamp_check CHECK (timestamp > 0)
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- GEMINI MODULE (AI Chat)
-- ============================================

-- Chat Sessions Table
-- Stores chat session metadata
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500), -- Optional: user-defined session title
    model VARCHAR(100) DEFAULT 'gemini-3-pro-preview',
    user_id UUID, -- Optional: for multi-user support
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
-- Stores individual chat messages within sessions
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant' or 'system'
    text TEXT NOT NULL,
    grounding_metadata JSONB, -- Optional: grounding metadata from AI
    use_thinking BOOLEAN DEFAULT false,
    use_grounding BOOLEAN DEFAULT false,
    sequence_number INTEGER NOT NULL, -- Order of message in session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_messages_role_check CHECK (role IN ('user', 'assistant', 'system'))
);

-- Indexes for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sequence ON chat_messages(session_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Gemini Image Generations Table
-- Stores image generation requests and results
CREATE TABLE IF NOT EXISTS gemini_image_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt TEXT NOT NULL,
    aspect_ratio VARCHAR(20) DEFAULT '1:1',
    is_hq BOOLEAN DEFAULT false,
    image_urls TEXT[], -- Array of image URLs
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for gemini_image_generations
CREATE INDEX IF NOT EXISTS idx_gemini_image_user_id ON gemini_image_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_gemini_image_created_at ON gemini_image_generations(created_at DESC);

-- Gemini Video Generations Table
-- Stores video generation requests and results
CREATE TABLE IF NOT EXISTS gemini_video_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt TEXT NOT NULL,
    aspect_ratio VARCHAR(20) DEFAULT '16:9',
    image_base64 TEXT, -- Optional: base64 encoded image
    video_url TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for gemini_video_generations
CREATE INDEX IF NOT EXISTS idx_gemini_video_user_id ON gemini_video_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_gemini_video_created_at ON gemini_video_generations(created_at DESC);

-- Gemini Transcriptions Table
-- Stores audio transcription requests and results
CREATE TABLE IF NOT EXISTS gemini_transcriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audio_base64 TEXT NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'audio/mp3',
    transcribed_text TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for gemini_transcriptions
CREATE INDEX IF NOT EXISTS idx_gemini_transcription_user_id ON gemini_transcriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_gemini_transcription_created_at ON gemini_transcriptions(created_at DESC);

-- Gemini TTS Table
-- Stores text-to-speech requests and results
CREATE TABLE IF NOT EXISTS gemini_tts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    audio_base64 TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for gemini_tts
CREATE INDEX IF NOT EXISTS idx_gemini_tts_user_id ON gemini_tts(user_id);
CREATE INDEX IF NOT EXISTS idx_gemini_tts_created_at ON gemini_tts(created_at DESC);

-- ============================================
-- USERS TABLE (Optional - for multi-user support)
-- ============================================

-- Users Table
-- If you need user management, uncomment and use this table
/*
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
*/

-- ============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_window_states_updated_at BEFORE UPDATE ON window_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_items_updated_at BEFORE UPDATE ON file_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert default settings (optional)
-- INSERT INTO settings (key, value, description, category) VALUES
-- ('theme', '"dark"', 'Application theme', 'appearance'),
-- ('language', '"en"', 'Application language', 'general'),
-- ('notifications_enabled', 'true', 'Enable notifications', 'notifications');

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE window_states IS 'Stores window/application states for the desktop environment';
COMMENT ON TABLE file_items IS 'Stores file and directory information';
COMMENT ON TABLE settings IS 'Stores application settings as key-value pairs';
COMMENT ON TABLE notifications IS 'Stores notification records';
COMMENT ON TABLE chat_sessions IS 'Stores AI chat session metadata';
COMMENT ON TABLE chat_messages IS 'Stores individual messages within chat sessions';
COMMENT ON TABLE gemini_image_generations IS 'Stores AI image generation requests and results';
COMMENT ON TABLE gemini_video_generations IS 'Stores AI video generation requests and results';
COMMENT ON TABLE gemini_transcriptions IS 'Stores audio transcription requests and results';
COMMENT ON TABLE gemini_tts IS 'Stores text-to-speech requests and results';