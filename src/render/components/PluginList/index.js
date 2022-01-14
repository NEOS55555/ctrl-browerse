import './index.scss'
// ipcOn('download-file-done')

export default function PluginList({
  list,
  onLiClick,
  liTitle,
  rightTitle,
  rightCtnRender,
}) {
  return (
    <ul className="plugin-list-wrapper">
      {list.map((it) => (
        <li key={it.appId} onClick={() => onLiClick(it)} title={liTitle}>
          <span className="icon">{it.name}</span>
          <div className="right-ctn">
            <div className="txt-ctn">
              <p className="title oneline-text">{it.name}</p>
              <p className="desc oneline-text">{it.desc}</p>
            </div>

            <div className="right-download-ctn" title={rightTitle}>
              {rightCtnRender && rightCtnRender(it)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
