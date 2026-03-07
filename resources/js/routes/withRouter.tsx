import { useNavigate } from 'react-router-dom';
import type { ComponentType } from 'react';
import { WithRouterProps } from '@/types/WithRouterProps';


// The HOC itself
export const withRouter = <P extends object>(
  WrappedComponent: ComponentType<P & WithRouterProps>
) => {
  const Wrapper = (props: P) => {
    const navigate = useNavigate();
    // Return the wrapped component, passing the navigate prop
    return <WrappedComponent {...props} navigate={navigate} />;
  };
  return Wrapper;
};