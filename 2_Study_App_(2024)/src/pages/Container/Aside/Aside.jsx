import "./Aside.scss"
export default function Aside({ links, selectedLink, onLinkClick, readLinks, handleDelClick,completionPercentage, totalLinksCount, readLinksCount }) {
    return (
        <aside className="sidebar">
        <nav>
          <p className="percent"> Пройдено {readLinksCount}/{totalLinksCount}</p>
          <div className="progress">
            <div className="line" style={{width:`${completionPercentage}%`}}></div>
          </div>
          <ul>
            {links.map((tag, index) => (
              <li key={index} className={`${selectedLink === tag ? 'selected-link' : ''} ${readLinks[tag] ? 'read' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); onLinkClick(tag); }}>{tag}</a>
              </li>
            ))}
          </ul>
          <button className="clearbtn" onClick={handleDelClick}>Очистить</button>
        </nav>
      </aside>
    )
}