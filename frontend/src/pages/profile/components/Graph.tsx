interface Props {
  graphTestImage: string;
}

export const Graph = ({graphTestImage}: Props) => {
  return (
    <div>
      <img
        src={graphTestImage}
        className="w-[100px] flex justify-center mx-auto"
        alt="Graph"
      />
    </div>
  );
};
