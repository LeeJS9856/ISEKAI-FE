import Live2DViewer from '@/components/Live2DViewer';

const ChattingPage = () => {
    const wsUrl = import.meta.env.VITE_WS_SERVER_URL;

    const modelConfig = {
        emotionMap: {
            'angry': 'exp_01',
            'sad': 'exp_02',
            'happy': 'exp_03'
        },
        // Using existing layout override logic from lappmodel if needed, or empty
    };

    return (
        <div>
            <div style={{ width: '500px', height: '500px', border: '1px solid white', marginLeft: '20px' }}>
                <Live2DViewer
                    modelUrl="/Resources/ANIYA.zip"
                    webSocketUrl={wsUrl}
                    modelConfig={modelConfig}
                />
            </div>
            <div style={{ width: '500px', height: '500px', border: '1px solid white', marginLeft: '20px' }}>
                <Live2DViewer
                    modelUrl="/Resources/ANIYA.zip"
                    webSocketUrl={wsUrl}
                    modelConfig={modelConfig}
                />
            </div>
            <div style={{ width: '500px', height: '500px', border: '1px solid white', marginLeft: '20px' }}>
                <Live2DViewer
                    modelUrl="/Resources/ANIYA.zip"
                    webSocketUrl={wsUrl}
                    modelConfig={modelConfig}
                />
            </div>
        </div>
    );
};

export default ChattingPage;