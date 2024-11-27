import React from "react";

const Container = ({ children, className }) => {
  return <div className={`mx-auto ${className}`}>{children}</div>;
};

export default Container;

/* old clases tailwind modal to add
<div class="flex flex-col items-center justify-start relative top-[90px] w-full">
  <!-- modalContainer en Tailwind CSS -->

  <div class="bg-[#949494] shadow-lg h-[820px] w-[80vw] mt-[80px] p-[10px_30px]">
    <!-- modalBasis en Tailwind CSS -->
  </div>
</div> */
