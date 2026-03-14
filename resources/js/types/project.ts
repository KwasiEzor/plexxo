export type ProjectStatus = 'pending' | 'generating' | 'draft' | 'finalized' | 'failed';
export type ChapterStatus = 'empty' | 'draft' | 'generating' | 'revising' | 'revised' | 'translating' | 'translated' | 'finalized' | 'failed';
export type SourceStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type SourceType = 'pdf' | 'docx';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Comment {
    id: number;
    user_id: number;
    chapter_id: number;
    content: string;
    is_resolved: boolean;
    created_at: string;
    user?: User;
}

export interface Project {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    status: ProjectStatus;
    language: string;
    template_id: string | null;
    description: string | null;
    style_guide?: Record<string, any>;
    settings?: Record<string, any>;
    chapters_count?: number;
    total_word_count?: number;
    created_at: string;
    updated_at: string;
    chapters?: Chapter[];
    sources?: Source[];
}

export interface Chapter {
    id: number;
    project_id: number;
    title: string;
    order: number;
    content: string | null;
    status: ChapterStatus;
    created_at: string;
    updated_at: string;
    comments?: Comment[];
}

export interface Source {
    id: number;
    project_id: number;
    title: string;
    type: SourceType;
    content: string | null;
    status: SourceStatus;
    created_at: string;
    updated_at: string;
}
