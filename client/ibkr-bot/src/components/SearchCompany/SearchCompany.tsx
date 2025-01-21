import { useMutation } from '@tanstack/react-query';
import { AutoComplete } from 'antd';
import { useContext, useState } from 'react';
import { Company } from '../../../../../types/company';
import { getCompanies } from '../../api/get-companies/get-companies';
import { formatData } from '../../utils/formatApiData';
import { SelectedStockContext } from '../AppLayout/AppLayout';

export const SearchCompany: React.FC<{ setSelectedStock: React.Dispatch<React.SetStateAction<Company | null>> }> = ({ setSelectedStock }) => {
    const selectedStock = useContext(SelectedStockContext);
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

    const handleOnSelect = (selectedItemValue: string) => {
        const selectedItem = formattedData.find((item) => item.cik === selectedItemValue) || null;
        setSelectedStock(selectedItem);
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
                onSearch={handleOnSearch}
                onSelect={handleOnSelect}
                onClear={() => setSelectedStock(null)}
                allowClear={true}
                value={selectedStock?.name}
                className="search-autocomplete"
                style={{
                    width: '400px',
                }}
                autoFocus
            />
        </div>
    );
};
