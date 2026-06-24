-- SQL Migration: MedBridge Elite Initial Schema Setup
-- Target Platform: Supabase PostgreSQL (with pgvector and RAG capabilities)
-- Estimated Scale: 100+ tables schema core representation.

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Core Tenant & Org Entities
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE health_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hq_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_system_id UUID REFERENCES health_systems(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    beds INTEGER NOT NULL DEFAULT 0,
    teaching_status BOOLEAN DEFAULT false NOT NULL,
    ownership TEXT CHECK (ownership IN ('Public', 'Private-Non-Profit', 'Private-For-Profit', 'Government')),
    excellence_score INTEGER CHECK (excellence_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User & RBAC Entities
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN (
        'CEO', 'Chief Medical Officer', 'Department Head', 'Quality Manager', 
        'Nurse Manager', 'Clinician', 'Hospital Data Manager', 'Health System Executive',
        'Researcher', 'Medical Reviewer', 'Pharma Sponsor', 'CRO', 'Admin'
    )) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Clinical Structure
CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    head_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    excellence_score INTEGER CHECK (excellence_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE hospital_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- e.g. Cardiology, Neurology, Overall Quality
    rank INTEGER NOT NULL,
    year INTEGER NOT NULL,
    source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE accreditations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. Joint Commission, Magnet Status
    issued_date DATE NOT NULL,
    expiry_date DATE,
    status TEXT CHECK (status IN ('Active', 'Pending', 'Suspended', 'Expired')) DEFAULT 'Active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Evidence & Protocols
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT[],
    journal_or_publisher TEXT,
    publication_date DATE,
    url TEXT,
    doi TEXT,
    confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN (
        'Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 
        'ICU', 'Surgery', 'Operations', 'Patient Flow', 'Quality', 'Research'
    )) NOT NULL,
    description TEXT NOT NULL,
    clinical_evidence_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE protocol_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    embedding vector(1536) -- For pgvector-based RAG search
);

CREATE TABLE protocol_kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_value TEXT NOT NULL,
    metric_type TEXT NOT NULL, -- e.g., Percentage, Minutes, Currency
    description TEXT
);

CREATE TABLE protocol_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    relevance_note TEXT
);

-- 5. Execution Layer (Improvement Projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    protocol_id UUID REFERENCES protocols(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('Planning', 'Active', 'Completed', 'On-Hold', 'Cancelled')) DEFAULT 'Planning' NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    lead_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('Todo', 'In-Progress', 'Done', 'Blocked')) DEFAULT 'Todo' NOT NULL,
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium' NOT NULL,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE project_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    mitigation_strategy TEXT,
    status TEXT CHECK (status IN ('Active', 'Mitigated', 'Triggered')) DEFAULT 'Active' NOT NULL
);

-- 6. Performance Benchmarking & Outcomes
CREATE TABLE metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    category TEXT CHECK (category IN ('Clinical', 'Operational', 'Financial', 'Patient Experience', 'Research', 'Workforce')) NOT NULL,
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    reporting_date DATE NOT NULL,
    national_benchmark NUMERIC,
    top_decile_benchmark NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Academy & Education
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL
);

CREATE TABLE webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    speaker_name TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_url TEXT
);

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Clinical Trials (TrialBridge Feature Flags Outlined)
CREATE TABLE trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    phase TEXT NOT NULL,
    therapeutic_area TEXT NOT NULL,
    sponsor_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('Recruiting', 'Active', 'Completed', 'Terminated')) DEFAULT 'Recruiting' NOT NULL,
    required_beds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE hospital_trial_eligibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    trial_id UUID NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    readiness_score INTEGER CHECK (readiness_score BETWEEN 0 AND 100),
    status TEXT CHECK (status IN ('Eligible', 'Under-Review', 'Approved', 'Rejected')) DEFAULT 'Under-Review' NOT NULL
);

-- 9. AI Conversations & RAG Sources
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 100),
    evidence_trace JSONB, -- Tracks vector similarity scores and matched nodes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE ai_message_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES ai_messages(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE
);

-- 10. Knowledge Graph Architecture
CREATE TABLE knowledge_graph_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT CHECK (entity_type IN ('Hospital', 'Protocol', 'Outcome', 'Study', 'Source', 'Trial', 'Certification', 'Project', 'Specialty')) NOT NULL,
    entity_id UUID NOT NULL, -- Generic foreign key matching id in specific entity table
    label TEXT NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE knowledge_graph_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_node_id UUID NOT NULL REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL, -- e.g. IMPLEMENTS, MEASURES, REFERENCES, ACCREDITED_BY, COLLABORATES
    weight NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_edge UNIQUE (source_node_id, target_node_id, relationship_type)
);

-- Indexes for performance & semantic search query performance
CREATE INDEX idx_hospitals_excellence ON hospitals(excellence_score DESC);
CREATE INDEX idx_metrics_lookup ON metrics(hospital_id, category, reporting_date DESC);
CREATE INDEX idx_projects_status ON projects(hospital_id, status);
CREATE INDEX idx_tasks_project ON tasks(project_id, status);
CREATE INDEX idx_protocol_sections_embedding ON protocol_sections USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_kg_edges_source ON knowledge_graph_edges(source_node_id);
CREATE INDEX idx_kg_edges_target ON knowledge_graph_edges(target_node_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- 1. Tenant Security: Users can only read/write organization data for their own org
CREATE POLICY tenant_org_policy ON organizations
    FOR ALL
    USING (id IN (SELECT organization_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY tenant_system_policy ON health_systems
    FOR ALL
    USING (organization_id IN (SELECT organization_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY tenant_hospital_policy ON hospitals
    FOR ALL
    USING (organization_id IN (SELECT organization_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY user_profile_policy ON users
    FOR ALL
    USING (organization_id IN (SELECT organization_id FROM users WHERE email = auth.jwt()->>'email'));

-- 2. Hospital Scope Security: Department managers and Clinicians can read/update their own departments/projects
CREATE POLICY hospital_dept_policy ON departments
    FOR ALL
    USING (hospital_id IN (SELECT hospital_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY hospital_project_policy ON projects
    FOR ALL
    USING (hospital_id IN (SELECT hospital_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY hospital_task_policy ON tasks
    FOR ALL
    USING (project_id IN (
        SELECT id FROM projects WHERE hospital_id IN (
            SELECT hospital_id FROM users WHERE email = auth.jwt()->>'email'
        )
    ));

-- 3. Analytics Access: Performance metrics are restricted to internal staff, except anonymized overall benchmarks
CREATE POLICY hospital_metrics_policy ON metrics
    FOR ALL
    USING (hospital_id IN (SELECT hospital_id FROM users WHERE email = auth.jwt()->>'email'));
