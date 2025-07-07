import React from 'react';
import Main from './Main/Main.jsx';
import Aside from './Aside/Aside';
import { useTags } from './useTags';
import './Container.scss'
export default function Container() {
    const {
        selectedTag,
        selectedLink,
        readLinks,
        links,
        totalLinksCount,
        readLinksCount,
        completionPercentage,
        synth,
        utterance,
        handleLinkClick,
        handleDelClick,
        handleNextLinkClick,
    } = useTags();
    return (
        <div className="container">
            <Aside
                links={links}
                selectedLink={selectedLink}
                onLinkClick={handleLinkClick}
                readLinks={readLinks}
                readLinksCount={readLinksCount}
                handleDelClick={handleDelClick}
                completionPercentage={completionPercentage}
                totalLinksCount={totalLinksCount}

            />
            <Main
                selectedLink={selectedLink}
                selectedTag={selectedTag}
                onNextClick={handleNextLinkClick}
                synth={synth}
                utterance={utterance}
            />
        </div>

    )
}