import React from "react";
import { useCollapse } from "react-collapsed";

interface AnimatedCollapseProps {
  show: boolean;
  children: React.ReactNode;
}

export const AnimatedCollapse = ({ show, children }: AnimatedCollapseProps) => {
  const { getCollapseProps } = useCollapse({ isExpanded: show });

  return (
    <div {...getCollapseProps()} className="w-full">
      <div>{children}</div>
    </div>
  );
};
