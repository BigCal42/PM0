/**
 * Discovery & Intake types
 * Used for multi-step questionnaire and project creation
 */

export type Domain =
  | 'workday'
  | 'epic'
  | 'oracle-cloud'
  | 'sap'
  | 'ukg'
  | 'oracle-health'
  | 'salesforce'
  | 'servicenow'
  | 'custom';

export interface DiscoveryFormData {
  // Step 1: Basic Information
  projectName: string;
  description: string;
  domain: Domain;
  
  // Step 2: Scope & Scale
  userCount: number;
  geographicLocations: string[];
  businessUnits: string[];
  
  // Step 3: Timeline & Constraints
  targetGoLiveDate?: string;
  hardDeadlines: string[];
  budgetRange?: string;
  
  // Step 4: Requirements
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  integrationRequirements: string[];
  
  // Step 5: Organization Context
  currentSystem?: string;
  migrationType: 'new-implementation' | 'upgrade' | 'migration' | 'replacement';
  changeManagementReadiness: 'low' | 'medium' | 'high';
}

export interface DiscoveryStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

