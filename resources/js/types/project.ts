export type ProjectStatus = 'pending' | 'generating' | 'draft' | 'finalized' | 'failed';
export type ChapterStatus = 'empty' | 'draft' | 'generating' | 'revising' | 'revised' | 'translating' | 'translated' | 'finalized' | 'failed';
export type SourceStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type SourceType = 'pdf' | 'docx';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Project {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    status: ProjectStatus;
    language: string;
    template_id: string | null;
    description: string | null;
    chapters_count?: number;
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
