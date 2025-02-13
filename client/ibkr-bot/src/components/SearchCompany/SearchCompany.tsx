import { useMutation } from '@tanstack/react-query';
import { AutoComplete } from 'antd';
import { useEffect, useState } from 'react';
import { Company } from '../../../../../types/company';
import { getCompanies } from '../../api/get-companies/get-companies';
import { useDebounce } from '../../hooks/useDebounce';
import { formatData } from '../../utils/formatApiData';

export const SearchCompany: React.FC<{ setSelectedStock: React.Dispatch<React.SetStateAction<Company | null>> }> = ({ setSelectedStock }) => {
    const [formattedData, setFormattedData] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { mutate } = useMutation({
        mutationFn: async (searchValue: string) => await getCompanies(searchValue),
        onSuccess(data, variables, context) {
            setFormattedData(formatData(data));
        },
    });

    useEffect(() => {
        if (!debouncedSearchTerm) return;
        handleOnSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const handleOnSearch = (searchValue: string) => {
        if (searchValue.length < 3) return;
        mutate(searchValue);
    };

    const handleOnSelect = (selectedItemValue: string) => {
        const selectedItem = formattedData.find((item) => item.cik === selectedItemValue) || null;
        if (!selectedItem) return;
        setSelectedStock(selectedItem);
        setSearchTerm(selectedItem.name);
    };

    const renderItem = (item: Company) => {
        return (
            <div key={item.cik}>
                <b>{item.ticker}</b>
                <br />
                <i>{item.name}</i>
            </div>
        );
    };

    return (
        <div>
            <AutoComplete
                options={formattedData.map((item) => ({
                    value: item.cik,
                    label: renderItem(item),
                }))}
                placeholder={'Search Company'}
                onSearch={(value) => setSearchTerm(value)}
                onSelect={handleOnSelect}
                onClear={() => {
                    setSelectedStock(null);
                    setSearchTerm('');
                }}
                allowClear={true}
                value={searchTerm}
                className="search-autocomplete"
                style={{
                    width: '400px',
                }}
                autoFocus
            />
        </div>
    );
};
