import { useState } from 'react';
import ChallengesManager from './cms/ChallengesManager';
import MissionsManager from './cms/MissionsManager';
import QuestionsManager from './cms/QuestionsManager';
import CurriculumPreview from './cms/CurriculumPreview';

/**
 * Top-level CMS page — manages navigation between challenges → missions → questions
 */
export default function ContentPage() {
  const [view, setView] = useState('challenges'); // 'challenges' | 'missions' | 'questions' | 'curriculum'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);

  const goToMissions = (challenge) => {
    setSelectedChallenge(challenge);
    setView('missions');
  };

  const goToQuestions = (mission) => {
    setSelectedMission(mission);
    setView('questions');
  };

  const goToCurriculum = (challenge) => {
    setSelectedChallenge(challenge);
    setView('curriculum');
  };

  const goBack = (target) => {
    if (target === 'challenges') {
      setSelectedChallenge(null);
      setSelectedMission(null);
      setView('challenges');
    } else if (target === 'missions') {
      setSelectedMission(null);
      setView('missions');
    }
  };

  return (
    <>
      {view === 'challenges' && (
        <ChallengesManager 
          onSelectChallenge={goToMissions} 
          onViewCurriculum={goToCurriculum}
        />
      )}
      {view === 'missions' && (
        <MissionsManager
          challenge={selectedChallenge}
          onSelectMission={goToQuestions}
          onBack={() => goBack('challenges')}
        />
      )}
      {view === 'questions' && (
        <QuestionsManager
          mission={selectedMission}
          challenge={selectedChallenge}
          onBack={goBack}
        />
      )}
      {view === 'curriculum' && (
        <CurriculumPreview
          challenge={selectedChallenge}
          onBack={() => goBack('challenges')}
        />
      )}
    </>
  );
}
