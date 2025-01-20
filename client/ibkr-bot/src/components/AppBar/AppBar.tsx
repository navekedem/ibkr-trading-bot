import { Button, Flex } from 'antd';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../../../../types/company';
import { SearchCompany } from '../SearchCompany/SearchCompany';

export const AppBar: React.FC<{ setSelectedStock: React.Dispatch<React.SetStateAction<Company | null>> }> = ({ setSelectedStock }) => {
    const navigate = useNavigate();
    return (
        <div style={{ backgroundColor: '#fff', display: 'flex', padding: '10px', justifyContent: 'space-between', boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)' }}>
            <Flex style={{ justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                <FaHome size={20} style={{ position: 'relative', bottom: '2px' }} />
                <div style={{ color: 'black', fontWeight: 'bold', fontSize: '1.3rem' }}>Trading Bot Dashboard</div>
                {/* <Button type="link" variant="link">
                    Dashboard
                </Button> */}
            </Flex>
            <Flex style={{ justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                <SearchCompany setSelectedStock={setSelectedStock} />
                <Button type="primary" style={{ borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem' }} onClick={() => navigate('/')}>
                    Logout
                </Button>
            </Flex>
        </div>
    );
};
