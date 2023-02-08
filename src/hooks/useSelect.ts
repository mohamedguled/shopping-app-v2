import { useState } from 'react';
export default function useSelect<Type>(
  options: Type[],
  defaultOption?: Type
) {
  const [currentOption, setCurrentOption] = useState<Type | null>(
    null
  );

  return {
    currentOption,
    setCurrentOption,
  };
}
