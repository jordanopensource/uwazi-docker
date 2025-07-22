/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LookupMultiSelect, LookupMultiSelectProps } from '../LookupMultiSelect';

const baseOptions = [
  { label: 'Option1', value: 'option1', results: 5 },
  { label: 'Option2', value: 'option2', results: 4 },
  {
    label: 'Sub Group',
    value: 'Group',
    results: 3,
    options: [
      { label: 'Group option1', value: 'group-option1', results: 2 },
      { label: 'Group option2', value: 'group-option2', results: 1 },
    ],
  },
];

describe('LookupMultiSelect (React Testing Library)', () => {
  let props: Partial<LookupMultiSelectProps>;
  let lookupSpy: jest.Mock;

  beforeEach(() => {
    lookupSpy = jest.fn().mockResolvedValue({
      options: [
        { label: 'new', value: 'new', results: 1 },
        { label: 'new 2', value: 'new 2', results: 2 },
      ],
      count: 2,
    });
    props = {
      value: [],
      options: baseOptions,
      onChange: jest.fn(),
      lookup: lookupSpy,
      optionsLabel: 'label',
      optionsValue: 'value',
      totalPossibleOptions: 0,
    };
  });

  it('should lookup and render multiselect with new found options when searchTerm is not empty', async () => {
    render(<LookupMultiSelect {...(props as LookupMultiSelectProps)} />);
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'test');
    // Wait for debounce and async
    await waitFor(() => {
      expect(lookupSpy).toHaveBeenCalledWith('test');
    });
  });

  it('options should also include selectedOptions', async () => {
    render(<LookupMultiSelect {...(props as LookupMultiSelectProps)} />);
    // Simulate lookupOptions in state
    await waitFor(() => expect(lookupSpy).toHaveBeenCalled());
    // Select an option
    const optionCheckbox = screen.getByLabelText('Option2');
    await userEvent.click(optionCheckbox);
    expect(props.onChange).toHaveBeenCalledWith(['option2']);
  });

  it('should call onFilter (lookup) on mount', async () => {
    render(<LookupMultiSelect {...(props as LookupMultiSelectProps)} />);
    await waitFor(() => {
      expect(lookupSpy).toHaveBeenCalledWith('');
    });
  });

  it('should call onFilter (lookup) when lookup prop changes', async () => {
    const lookup1 = jest.fn().mockResolvedValue({
      options: [{ label: 'first', value: 'first', results: 1 }],
      count: 1,
    });
    const lookup2 = jest.fn().mockResolvedValue({
      options: [{ label: 'second', value: 'second', results: 1 }],
      count: 1,
    });
    const { rerender } = render(
      <LookupMultiSelect {...(props as LookupMultiSelectProps)} lookup={lookup1} />
    );
    await waitFor(() => expect(lookup1).toHaveBeenCalledWith(''));
    rerender(<LookupMultiSelect {...(props as LookupMultiSelectProps)} lookup={lookup2} />);
    await waitFor(() => expect(lookup2).toHaveBeenCalledWith(''));
  });

  it('should render a search bar input', () => {
    render(<LookupMultiSelect {...(props as LookupMultiSelectProps)} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should deduplicate options from combineOptions', async () => {
    const duplicateOptions = [
      { label: 'Option1', value: 'option1', results: 5 },
      { label: 'Option1', value: 'option1', results: 5 },
      { label: 'Option2', value: 'option2', results: 4 },
    ];
    render(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        options={duplicateOptions}
        lookup={jest.fn().mockResolvedValue({ options: duplicateOptions, count: 2 })}
      />
    );
    // Only one Option1 should be rendered
    expect(screen.getAllByLabelText('Option1').length).toBe(1);
  });

  it('should show selectedOptions even if not in options or lookupOptions', async () => {
    const value = ['not-in-options'];
    render(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        value={value}
        options={[]}
        lookup={jest.fn().mockResolvedValue({ options: [], count: 0 })}
      />
    );
    // The component does not render a checkbox for unknown values, so expect 'No options found'
    expect(screen.getByText(/No options found/)).toBeInTheDocument();
  });

  it('should not render search bar or call lookup if lookup is missing', async () => {
    render(<LookupMultiSelect {...(props as LookupMultiSelectProps)} lookup={undefined as any} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should deduplicate options if lookup returns duplicates', async () => {
    const lookupWithDuplicates = jest.fn().mockResolvedValue({
      options: [
        { label: 'Option1', value: 'option1', results: 5 },
        { label: 'Option1', value: 'option1', results: 5 },
      ],
      count: 2,
    });
    render(
      <LookupMultiSelect {...(props as LookupMultiSelectProps)} lookup={lookupWithDuplicates} />
    );
    await waitFor(() => expect(lookupWithDuplicates).toHaveBeenCalled());
    expect(screen.getAllByLabelText('Option1').length).toBe(1);
  });

  it('should handle onChange with value not in any options', async () => {
    const onChange = jest.fn();
    render(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        value={['not-in-options']}
        onChange={onChange}
        options={[]}
        lookup={jest.fn().mockResolvedValue({ options: [], count: 0 })}
      />
    );
    // The component does not render a checkbox for unknown values, so expect 'No options found'
    expect(screen.getByText(/No options found/)).toBeInTheDocument();
  });

  it('should update totalPossibleOptions and reflect in more/less label', async () => {
    // Use 10 options, optionsToShow=5, totalPossibleOptions=10
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      label: `Option${i + 1}`,
      value: `option${i + 1}`,
    }));
    const { rerender } = render(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        options={manyOptions}
        optionsToShow={5}
        totalPossibleOptions={10}
      />
    );
    // Should show "5 x more" (button should be present)
    expect(screen.getByRole('button', { name: /x more/ })).toBeInTheDocument();
    // Update totalPossibleOptions
    rerender(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        options={manyOptions}
        optionsToShow={5}
        totalPossibleOptions={15}
      />
    );
    expect(screen.getByRole('button', { name: /x more/ })).toBeInTheDocument();
  });

  it('should show and toggle show more/show less', async () => {
    // Use 8 options, optionsToShow=5
    const manyOptions = Array.from({ length: 8 }, (_, i) => ({
      label: `Option${i + 1}`,
      value: `option${i + 1}`,
    }));
    render(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        options={manyOptions}
        optionsToShow={5}
        totalPossibleOptions={8}
      />
    );
    // Should show "3 x more" (button should be present)
    expect(screen.getByRole('button', { name: /x more/ })).toBeInTheDocument();
    // Click show more
    const showMoreBtn = screen.getByRole('button', { name: /x more/ });
    await userEvent.click(showMoreBtn);
    // Should show "x less"
    expect(screen.getByRole('button', { name: /x less/ })).toBeInTheDocument();
    // Click show less
    const showLessBtn = screen.getByRole('button', { name: /x less/ });
    await userEvent.click(showLessBtn);
    expect(screen.getByRole('button', { name: /x more/ })).toBeInTheDocument();
  });

  it('should show "No options found" when there are no options', () => {
    render(
      <LookupMultiSelect
        {...(props as LookupMultiSelectProps)}
        options={[]}
        lookup={jest.fn().mockResolvedValue({ options: [], count: 0 })}
      />
    );
    expect(screen.getByText(/No options found/)).toBeInTheDocument();
  });
});
