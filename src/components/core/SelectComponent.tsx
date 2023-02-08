import useSelect from '../../hooks/useSelect';
import { PresetType } from '../../db';
import { Listbox } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Fragment, useEffect } from 'react';
import { useSelectStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { useEffectOnce } from 'usehooks-ts';

export default function SelectComponent({
  options,
  defaultOption,
}: {
  options: PresetType[];
  defaultOption: PresetType;
}) {
  //   const { currentOption, setCurrentOption } =
  //     useSelect<PresetType>(options);

  const { items, currentItem, setCurrentItem, setItems } =
    useSelectStore(
      (state) => ({
        items: state.items,
        currentItem: state.currentItem,
        setItems: state.setItems,
        setCurrentItem: state.setCurrentItem,
      }),
      shallow
    );

  useEffect(() => {
    setItems(options);
  }, [setItems, options]);

  useEffectOnce(() => {
    setCurrentItem(options[0]);
  });

  return (
    <div className='relative'>
      <Listbox defaultValue={defaultOption} onChange={setCurrentItem}>
        <Listbox.Button className='border border-gray-300 flex items-center justify-center bg-white text-black py-2 px-2 gap-1'>
          {currentItem?.name ?? 'Välj'}
          <MdKeyboardArrowDown />
        </Listbox.Button>
        <Listbox.Options className='min-w-full border border-gray-300 rounded-sm bg-white dark:bg-gray-800 text-black dark:text-white absolute px-0 mt-0.5'>
          {options.map((option) => (
            <Fragment key={option.name}>
              {option.name !== currentItem?.name ? (
                <Listbox.Option key={option.name} value={option}>
                  {({ active }) => (
                    <li
                      className={`${
                        active
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-black'
                      } px-2 py-1 cursor-pointer`}
                    >
                      <p>{option.name}</p>
                    </li>
                  )}
                </Listbox.Option>
              ) : null}
            </Fragment>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
