import { Modal, ModalProps } from 'antd';
import { CompanyAnalysisResponse } from '../../../../../types/company';

type ModalAnalysisProps = ModalProps & {
    title: string;
};

export const ModalAnalysis: React.FC<ModalAnalysisProps> = ({ open, onClose, title, children, onOk }) => {
    return (
        <Modal open={open} title={title} onClose={onClose} okText="Submit Order" onCancel={onClose} onOk={onOk}>
            <div>{children}</div>
        </Modal>
    );
};

const flexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};
const headlineStyle = {
    fontWeight: 'bold',
    fontSize: '1.2rem',
};

export const AnalysisContent: React.FC<CompanyAnalysisResponse> = ({
    entryPrice,
    takeProfit,
    keyInsights,
    confidenceScore,
    stoploss,
    riskLevel,
    position,
    expectedDuration,
}) => {
    return (
        <>
            <div style={{ marginBottom: '10px' }}>{keyInsights}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Position</div>
                    <div>{position}</div>
                </div>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Entry Price</div>
                    <div>${entryPrice}</div>
                </div>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Take Profit</div>
                    <div>${takeProfit}</div>
                </div>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Confidence Score (0-100%)</div>
                    <div>{confidenceScore.includes('%') ? confidenceScore : `${confidenceScore}%`}</div>
                </div>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Stoploss</div>
                    <div>${stoploss}</div>
                </div>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Risk Level</div>
                    <div>{riskLevel}</div>
                </div>
                <div style={flexStyle}>
                    <div style={headlineStyle}>Position Duration</div>
                    <div>{expectedDuration} days</div>
                </div>
            </div>
        </>
    );
};
