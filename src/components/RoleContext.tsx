'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  walletAddress: string;
  userName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('public');

  const getRoleIdentity = (currentRole: UserRole) => {
    switch (currentRole) {
      case 'developer':
        return {
          address: '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
          name: 'Dr. Debabrata Mukherjee (Project Owner)',
        };
      case 'field_officer':
        return {
          address: '0x5592EC0cfb4dbc12D3aD100b257153436a1f0FEa',
          name: 'Rajesh Sen (Field Officer - Forest Dept)',
        };
      case 'verifier':
        return {
          address: '0x435422896A62024CE95B7286375F119a0A678d10',
          name: 'Dr. Elena Rostova (ISO 14065 Auditor)',
        };
      case 'buyer':
        return {
          address: '0x2289c09470984E29038d102eef5781a9425c2763',
          name: 'EcoTech Global ESG Portfolio Ltd',
        };
      case 'admin':
        return {
          address: '0xAdminRegistryProtocol99a0A678d10204CE95B7',
          name: 'Blue Carbon Registry Authority Admin',
        };
      default:
        return {
          address: '0x0000000000000000000000000000000000000000',
          name: 'Public Guest Observer',
        };
    }
  };

  const identity = getRoleIdentity(role);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        walletAddress: identity.address,
        userName: identity.name,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
