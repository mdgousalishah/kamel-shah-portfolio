/**
 * SceneController.ts
 * Deterministic scroll timeline mapping 0.0 -> 1.0 global scroll progress to
 * 5 distinct cinematic scenes and organic wipe transitions.
 */

export interface SceneDefinition {
  id: string;
  number: string;
  name: string;
  start: number;
  end: number;
  transitionStart?: number;
  transitionEnd?: number;
}

export const SCENE_DEFINITIONS: SceneDefinition[] = [
  {
    id: 'identity',
    number: '01',
    name: 'IDENTITY & VISION',
    start: 0.00,
    end: 0.22,
    transitionStart: 0.16,
    transitionEnd: 0.22,
  },
  {
    id: 'agentic-ai',
    number: '02',
    name: 'AGENTIC AI & NEURAL SYSTEMS',
    start: 0.22,
    end: 0.43,
    transitionStart: 0.37,
    transitionEnd: 0.43,
  },
  {
    id: 'full-stack',
    number: '03',
    name: 'FULL-STACK ARCHITECTURE',
    start: 0.43,
    end: 0.64,
    transitionStart: 0.58,
    transitionEnd: 0.64,
  },
  {
    id: 'projects',
    number: '04',
    name: 'PRODUCTION PLATFORMS',
    start: 0.64,
    end: 0.85,
    transitionStart: 0.79,
    transitionEnd: 0.85,
  },
  {
    id: 'contact',
    number: '05',
    name: 'EXPERIENCE & NEXUS',
    start: 0.85,
    end: 1.00,
    transitionStart: 0.93,
    transitionEnd: 1.00,
  },
];

export interface SceneTimelineState {
  globalProgress: number;
  activeSceneIndex: number;
  nextSceneIndex: number;
  sceneProgress: number; // 0.0 -> 1.0 within current scene
  isTransitioning: boolean;
  transitionProgress: number; // 0.0 -> 1.0 of the organic wipe
  activeScene: SceneDefinition;
  nextScene: SceneDefinition;
  isTimelineExiting: boolean;
  timelineExitProgress: number; // 0.0 -> 1.0 for continuous handoff to Identity & Philosophy
}

export function computeSceneTimeline(progress: number): SceneTimelineState {
  const p = Math.max(0, Math.min(1, progress));
  const isTimelineExiting = p >= 0.93;
  const timelineExitProgress = isTimelineExiting ? Math.min(1, Math.max(0, (p - 0.93) / 0.07)) : 0;

  // Determine which segment we are in
  for (let i = 0; i < SCENE_DEFINITIONS.length; i++) {
    const scene = SCENE_DEFINITIONS[i];
    const hasTransition = scene.transitionStart !== undefined && scene.transitionEnd !== undefined;

    // Within active scene hold
    if (p >= scene.start && (!hasTransition || p < scene.transitionStart!)) {
      const duration = hasTransition ? (scene.transitionStart! - scene.start) : (scene.end - scene.start);
      const sceneP = duration > 0 ? (p - scene.start) / duration : 1;

      return {
        globalProgress: p,
        activeSceneIndex: i,
        nextSceneIndex: Math.min(i + 1, SCENE_DEFINITIONS.length - 1),
        sceneProgress: Math.max(0, Math.min(1, sceneP)),
        isTransitioning: false,
        transitionProgress: 0,
        activeScene: scene,
        nextScene: SCENE_DEFINITIONS[Math.min(i + 1, SCENE_DEFINITIONS.length - 1)],
        isTimelineExiting,
        timelineExitProgress,
      };
    }

    // Within transition to next scene
    if (hasTransition && p >= scene.transitionStart! && p < scene.transitionEnd!) {
      const transDuration = scene.transitionEnd! - scene.transitionStart!;
      const transP = transDuration > 0 ? (p - scene.transitionStart!) / transDuration : 0;
      const nextIndex = Math.min(i + 1, SCENE_DEFINITIONS.length - 1);

      return {
        globalProgress: p,
        activeSceneIndex: i,
        nextSceneIndex: nextIndex,
        sceneProgress: 1,
        isTransitioning: i < SCENE_DEFINITIONS.length - 1, // Only transition shader between scenes 1->2, 2->3, 3->4, 4->5
        transitionProgress: Math.max(0, Math.min(1, transP)),
        activeScene: scene,
        nextScene: SCENE_DEFINITIONS[nextIndex],
        isTimelineExiting,
        timelineExitProgress,
      };
    }
  }

  // Fallback / last scene
  const lastIndex = SCENE_DEFINITIONS.length - 1;
  return {
    globalProgress: p,
    activeSceneIndex: lastIndex,
    nextSceneIndex: lastIndex,
    sceneProgress: 1,
    isTransitioning: false,
    transitionProgress: 0,
    activeScene: SCENE_DEFINITIONS[lastIndex],
    nextScene: SCENE_DEFINITIONS[lastIndex],
    isTimelineExiting,
    timelineExitProgress,
  };
}
