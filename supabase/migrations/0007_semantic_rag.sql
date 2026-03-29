create extension if not exists vector;

alter table public.rag_memories
add column if not exists embedding vector(1536);

create index if not exists rag_memories_embedding_idx
on public.rag_memories
using ivfflat (embedding vector_cosine_ops)
with (lists = 50);

create or replace function public.match_rag_memories(
  query_embedding vector(1536),
  match_count int default 5,
  target_spore_id uuid default null
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql
stable
as $$
  select
    rag_memories.id,
    rag_memories.content,
    rag_memories.metadata,
    1 - (rag_memories.embedding <=> query_embedding) as similarity
  from public.rag_memories
  where (target_spore_id is null or rag_memories.spore_id = target_spore_id)
    and rag_memories.embedding is not null
  order by rag_memories.embedding <=> query_embedding
  limit match_count;
$$;
