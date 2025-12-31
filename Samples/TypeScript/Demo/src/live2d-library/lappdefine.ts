import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample App에서 사용하는 상수
 */

// 캔버스 크기 - auto로 설정시 화면 전체 사용
export const CanvasSize: { width: number; height: number } | 'auto' = 'auto';

// 화면 초기화 배경색 R, G, B, A
export const ViewScale = 1.0;
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;
export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 리소스 경로
export const ResourcesPath = '/Resources/';



// 모델 정의
export const ModelDir: string[] = ['ANIYA', 'HoshinoAi'];
export const ModelDirSize: number = ModelDir.length;

// 외부 정의
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// 모션 그룹
export const MotionGroupIdle = 'Idle';
export const MotionGroupTapBody = 'TapBody';

// 우선순위
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// 디버그 모드
export const DebugLogEnable = true;
export const DebugTouchLogEnable = false;

// Framework 로그 레벨
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// 캔버스 수
export const CanvasNum = 1;

// MOC3 일관성 검증
export const MOCConsistencyValidationEnable = true;
export const MotionConsistencyValidationEnable = true;
