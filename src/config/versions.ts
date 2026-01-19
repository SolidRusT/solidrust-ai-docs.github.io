/**
 * API Version Configuration
 * 
 * Defines available API versions for documentation.
 * The latest version is always shown by default.
 */

export interface APIVersion {
  /** Version identifier (e.g., 'v1', 'v2') */
  id: string;
  /** Display label */
  label: string;
  /** Release date */
  releaseDate: string;
  /** Whether this is the current/latest version */
  current: boolean;
  /** Whether this version is deprecated */
  deprecated?: boolean;
  /** Deprecation notice if deprecated */
  deprecationNotice?: string;
  /** Link to migration guide */
  migrationGuide?: string;
  /** Changelog anchor for this version */
  changelogAnchor?: string;
}

export const API_VERSIONS: APIVersion[] = [
  {
    id: 'v1',
    label: 'v1 (Current)',
    releaseDate: '2026-01-16',
    current: true,
    changelogAnchor: '#2026-01-16---public-launch',
  },
  // Future versions will be added here:
  // {
  //   id: 'v2',
  //   label: 'v2 (Beta)',
  //   releaseDate: '2026-XX-XX',
  //   current: false,
  //   changelogAnchor: '#v2-release',
  // },
];

/**
 * Get the current/latest API version
 */
export function getCurrentVersion(): APIVersion {
  return API_VERSIONS.find(v => v.current) || API_VERSIONS[0];
}

/**
 * Get a specific version by ID
 */
export function getVersionById(id: string): APIVersion | undefined {
  return API_VERSIONS.find(v => v.id === id);
}

/**
 * Check if there are multiple versions available
 */
export function hasMultipleVersions(): boolean {
  return API_VERSIONS.length > 1;
}
