// production build for the local docker simulation:
// host.docker.internal reaches the backend from inside the container and,
// thanks to docker desktop's hosts entry, from the browser as well
export const environment = {
  PRODUCTION: true,
  ENVIRONMENT: 'docker',
  PROJECT_SERVICE_BASE_URL: 'http://host.docker.internal:8081/api/public/projects',
  TESTIMONIAL_SERVICE_BASE_URL: 'http://host.docker.internal:8081/api/public/testimonials',
};
