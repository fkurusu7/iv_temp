import { useEffect, useRef, useState } from "react";

function InPageNavigation({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) {
  const activeTabLineRef = useRef();
  const activeTabRef = useRef();
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, i) => {
    const { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
    setInPageNavIndex(i);
  };

  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex);
  }, []);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              key={i}
              ref={i == defaultActiveIndex ? activeTabRef : null}
              className={`py-4 px-5 capitalize ${
                i === inPageNavIndex ? "text-black" : "text-dark-grey"
              } ${defaultHidden.includes(route) ? " md:hidden" : ""}`}
              onClick={(ev) => changePageState(ev.target, i)}
            >
              {route}
            </button>
          );
        })}
        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
}

export default InPageNavigation;
