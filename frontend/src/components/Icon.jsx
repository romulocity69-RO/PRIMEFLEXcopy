import * as Icons from "lucide-react";

// Renders a lucide-react icon by its string name.
const Icon = ({ name, ...props }) => {
  const Cmp = Icons[name] || Icons.Circle;
  return <Cmp {...props} />;
};

export default Icon;
