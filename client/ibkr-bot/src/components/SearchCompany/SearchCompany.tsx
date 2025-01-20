import { useMutation } from '@tanstack/react-query';
import { AutoComplete } from 'antd';
import { useState } from 'react';
import { Company } from '../../../../../types/company';
import { getCompanies } from '../../api/get-companies/get-companies';
import { formatData } from '../../utils/formatApiData';

export const SearchCompany: React.FC<{ setSelectedStock: React.Dispatch<React.SetStateAction<Company | null>> }> = ({ setSelectedStock }) => {
    const [formattedData, setFormattedData] = useState<Company[]>([]);
    const { mutate } = useMutation({
        mutationFn: async (searchValue: string) => await getCompanies(searchValue),
        onSuccess(data, variables, context) {
            setFormattedData(formatData(data));
        },
    });

    const handleOnSearch = (searchValue: string) => {
        if (searchValue.length < 3) return;
        mutate(searchValue);
    };

    const handleOnSelect = (item: Company) => {
        setSelectedStock(item);
    };

    const formatResult = (item: Company) => {
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
                    label: formatResult(item),
                }))}
                placeholder={'Search Company'}
                onSearch={handleOnSearch}
                onSelect={handleOnSelect}
                onClear={() => setSelectedStock(null)}
                allowClear={true}
                className="search-autocomplete"
                style={{
                    width: '400px',
                }}
                autoFocus
            />
        </div>
    );
};
