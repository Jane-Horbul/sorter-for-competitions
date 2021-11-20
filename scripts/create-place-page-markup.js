
export const markup = {
    common: {
        setPageHeader(name)             {document.getElementById("page-header-name").innerHTML = name;},
        setPageHeaderLink(link)         {document.getElementById("page-header-name-link").setAttribute("href", link);},
        setDepartmentLink(name, link)   {var d = document.getElementById("department-link"); d.setAttribute("href", link); d.innerHTML = name;},
        setCompetitionLink(name, link)  {var c = document.getElementById("competition-link"); c.setAttribute("href", link); c.innerHTML = name;},
    }
}