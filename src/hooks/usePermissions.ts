/**
 * Hook to access storage permission state and actions.
 */
import { useContext } from 'react';
import { PermissionContext } from '../contexts/PermissionContext';

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
}
