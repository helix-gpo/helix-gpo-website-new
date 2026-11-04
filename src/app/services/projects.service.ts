import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from '../model/projects/project';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly projectsResource = httpResource<Project[]>(
    () => environment.PROJECT_SERVICE_BASE_URL,
    { defaultValue: [] },
  );

  readonly projects = computed(() => this.projectsResource.value() ?? []);
  readonly loading = computed(() => this.projectsResource.isLoading());
}
