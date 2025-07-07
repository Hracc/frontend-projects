import './Main.scss'
import { useState } from 'react';
export default function Main({ selectedTag, onNextClick, selectedLink, synth, utterance }) {
    const [speaking, setSpeaking] = useState(false)
    const [paused, setPaused] = useState(false)
    utterance.onstart = () => { setSpeaking(true) }
    utterance.onend = () => { setSpeaking(false); setPaused(false) }
    utterance.onerror = () => { setSpeaking(false); setPaused(false) }
    utterance.onpause = () => { setPaused(true) }
    utterance.onresume = () => { setPaused(false) }
    return (
        <main className="main-content" id='letter'>
            {selectedTag ?
                <>
                    <div className='speaking'>
                        {!speaking ?
                            <button onClick={() => { synth.cancel(); synth.speak(utterance) }}>Воспроизвести</button>
                            :
                            !paused ? <button onClick={() => { synth.pause(); }}>Приостановить</button>
                                : <button onClick={() => { synth.resume(); }}>Возобновить</button>}
                        <button onClick={() => { synth.cancel(); }}>Выключить</button>
                    </div>
                    <h2>{selectedLink}</h2>
                    <p>{selectedTag.content}</p>
                    <button className='finish' onClick={onNextClick}>Завершить раздел</button>
                </>
                : <p>Выберите тему</p>
            }
        </main >
    )
}