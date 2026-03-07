import { useLocation, useNavigate } from 'react-router-dom';
import type { ComponentType } from 'react';
import { WithRouterLocationProps, WithRouterProps } from '@/types/WithRouterProps';
import React from 'react';


// The HOC itself
export const withLocation = <P extends WithRouterLocationProps>(
  WrappedComponent: React.ComponentType<P>
) => {
    return (props: Omit<P, keyof WithRouterLocationProps>) => {
        const location = useLocation();

        // Using React.createElement prevents the "refers to a value but used as type" error
        return React.createElement(WrappedComponent, {
          ...(props as P),
          location,
        });
      }
}