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
    end: 0.16,
    transitionStart: 0.16,
    transitionEnd: 0.20,
  },
  {
    id: 'agentic-ai',
    number: '02',
    name: 'AGENTIC AI & NEURAL SYSTEMS',
    start: 0.20,
    end: 0.36,
    transitionStart: 0.36,
    transitionEnd: 0.40,
  },
  {
    id: 'full-stack',
    number: '03',
    name: 'FULL-STACK ARCHITECTURE',
    start: 0.40,
    end: 0.56,
    transitionStart: 0.56,
    transitionEnd: 0.60,
  },
  {
    id: 'projects',
    number: '04',
    name: 'PRODUCTION PLATFORMS',
    start: 0.60,
    end: 0.78,
    transitionStart: 0.78,
    transitionEnd: 0.83,
  },
  {
    id: 'contact',
    number: '05',
    name: 'EXPERIENCE & NEXUS',
    start: 0.83,
    end: 1.00,
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
}

export function computeSceneTimeline(progress: number): SceneTimelineState {
  const p = Math.max(0, Math.min(1, progress));

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
        isTransitioning: true,
        transitionProgress: Math.max(0, Math.min(1, transP)),
        activeScene: scene,
        nextScene: SCENE_DEFINITIONS[nextIndex],
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
  };
}
