import "./Header.scss";
import { useState, useEffect } from "react";
import ministry from "../../assets/images/education_ministry.svg";
import dropdownimg from "../../assets/images/dropdown-icon.svg";
import SlidingTabBar from "./SlidingTabBar";
import { useDispatch, useSelector } from "react-redux";
import { urls } from "../../constants/constants";
import { useLocation, Link } from "react-router-dom";
import i18n from "../../components/i18next/i18n"; /*Don't remove it*/
import { useTranslation } from "react-i18next";
import { updateToggleDark } from "../../redux/slice/darkLightModeSlice";

const Header = () => {
  const location = useLocation();

  const header_name = useSelector((state) => state.header);
  const toggleDarkMode = useSelector((state) => state.toggle.toggleDarkLight);
  const dispatch = useDispatch();

  const changeSizeByBtn = (size) => {
    
    if (size === "normal") {
      document.body.className = "DecreaseFont";
    } else if (size === "average") {
      // document.body.style.fontSize = "16px";
      document.body.className = "AverageFont";
    } else if (size === "max") {
      // document.body.style.fontSize = "18px";
      document.body.className = "MaxFont";
    }
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    localStorage.setItem("selectedLanguage", selectedLanguage); // Save selected language to local storage
    i18n.changeLanguage(selectedLanguage); // Change the language in i18n
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (!savedLanguage) {
      localStorage.setItem("selectedLanguage", "en");
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleClickScroll = () => {
    const element = document.getElementById("content");
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleDarkTheme = () => {
    dispatch(updateToggleDark(!toggleDarkMode));
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to format the date in the desired format
  const formatDateString = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const ordinalSuffix = getOrdinalSuffix(day);

    return (
      <a href="#" className="date-link">
        {day}
        <sup className="ordinal">{ordinalSuffix} </sup> &nbsp;{month} {year}
      </a>
    );
  };

  // Function to get the ordinal suffix for a given day
  const getOrdinalSuffix = (day) => {
    if (day === 1 || day === 21 || day === 31) {
      return "st";
    } else if (day === 2 || day === 22) {
      return "nd";
    } else if (day === 3 || day === 23) {
      return "rd";
    } else {
      return "th";
    }
  };

  const goToPageOnClick = () => {
    // navigate("/");
    window.location.href = window.location.origin;
  };

  return (
    <>
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="header-top-content">
                <div className="header-top-skipwrap top-date-time">
                  <ul>
                    <li>{formatDateString(currentDateTime)}</li>
                    <li>
                      <a href="#">{currentDateTime.toLocaleTimeString()}</a>
                    </li>
                  </ul>
                </div>

                <div className="header-top-skipwrap">
                  <ul>
                    <li>
                      <Link to="/help-line-numbers">
                        {t("helpline_numbers")}
                      </Link>
                    </li>
                    {/* <li><Link to='#' onClick={handleClickScroll}>{t("skip_to_navigation")}</Link></li> */}
                    <li>
                      <Link to="#" onClick={handleClickScroll}>
                        {t("skip_to_main_content")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/screen-reader-access">
                        {t("screen_reader_access")}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="header-top-skipwrap right-access-points">
                  <ul>
                    <li>
                      <div id="form-wrapper">
                        <form action="" method="" className="font-item">
                          <span className="font-t">A</span>
                          <div id="debt-amount-slider">
                            <input
                              type="radio"
                              name="debt-amount"
                              id="1"
                              value="1"
                              required=""
                              title="Decrease Font Size"
                              onClick={() => changeSizeByBtn("normal")}
                            />
                            <label
                              htmlFor="1"
                              title="Decrease Font Size"
                            ></label>
                            <input
                              type="radio"
                              name="debt-amount"
                              id="2"
                              value="2"
                              defaultChecked="checked"
                              required=""
                              title="Normal Font Size"
                              onClick={() => changeSizeByBtn("average")}
                            />
                            <label htmlFor="2" title="Normal Font Size"></label>
                            <input
                              type="radio"
                              name="debt-amount"
                              id="3"
                              value="3"
                              required=""
                              title="Increase Font Size"
                              onClick={() => changeSizeByBtn("max")}
                            />
                            <label
                              htmlFor="3"
                              title="Increase Font Size"
                            ></label>
                            <div id="debt-amount-pos"></div>
                          </div>
                          <span className="font-t size-16">A</span>
                        </form>
                      </div>
                    </li>

                    <li>
                      <div className="d-flex align-items-center">
                        <span className="text me-2"> {toggleDarkMode ?t("light_mode") :t("dark_mode") } </span>
                        <label className="switch mb-0" title={toggleDarkMode ? t("light_mode"):t("dark_mode") }>
                          <input
                            type="checkbox"
                            id="mode"
                            checked={toggleDarkMode}
                            onClick={toggleDarkTheme}
                          />
                          <span className="slider round"></span>
                        </label>
                        {/* <Switch  onChange={toggleDarkTheme} /> */}
                      </div>
                    </li>

                    <li>
                      <div className="d-flex align-items-center">
                        <span className="text me-2">{t("language")} </span>
                        <a>
                          <div className="select-wrap">
                            <select
                              className="form-select Langchange"
                              value={i18n.language}
                              onChange={changeLanguage}
                            >
                              <option value="en">English</option>
                              <option value="hi">हिन्दी</option>
                            </select>
                            <span className="material-icons">
                              arrow_drop_down
                            </span>
                          </div>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <div className="logo-wrap">
                  <Link
                    to="/"
                    onClick={goToPageOnClick}
                    className="top-logo ordernav-sm-1"
                  >
                    {" "}
                    <img
                      src={ministry}
                      alt="logo"
                      className="img-fluid logo-main"
                      title="Ministry Logo"
                    />
                  </Link>

                  <div className="menu-switch-tab ordernav-sm-3">
                    <SlidingTabBar />
                  </div>

                  <div className="ordernav-sm-2">
                    {header_name.headerName !== "All Reports" &&
                    !urls.includes(location.pathname) ? (
                      <Link
                        className="header-dropdown-btn"
                        title="UDISE+ Reports"
                        to="/reports"
                      >
                        {t("udise_reports")}
                        <img src={dropdownimg} alt="UDISE+ Reports" />{" "}
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header