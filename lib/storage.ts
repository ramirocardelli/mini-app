import { Project } from './types';

const STORAGE_KEY = 'lemoncash_projects';

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const projects = JSON.parse(stored);
    return projects.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }));
  } catch {
    return [];
  }
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  projects.push(project);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function updateProject(projectId: string, updates: Partial<Project>): void {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}
