var portfolio = require('../controllers/PortfolioController')

function dateToStringDate(_date) {
    return new Date(_date).toISOString().slice(0, 10).replace('T', ' ');
}
exports.dateToStringDate = dateToStringDate

async function getStartDateFromQuery(usr_id, date_query) {
    return new Promise(function(resolve, reject) {
        if(date_query === "month") {
            resolve(new Date().setMonth(new Date().getMonth() - 1));
        } else {
            if(date_query === "week") {
                resolve(new Date().setDate(new Date().getDate() - 7));
            } else {
                if(date_query === "all") {
                    portfolio.getPortfolioStartDate(usr_id).then(res => resolve(res));
                } else {
                    resolve(new Date().setYear(new Date().getFullYear() - 1));
                }
            }
        }
    });
}

async function translateStartDateQueryToStringDate(usr_id, start_date_query) {
    return new Promise(function(resolve, reject) {
        getStartDateFromQuery(usr_id, start_date_query).then(start_date => {
            resolve(dateToStringDate(start_date));
        })
    });
  }
exports.translateStartDateQueryToStringDate = translateStartDateQueryToStringDate;

function getDatesFromDateToNow(start_date) {
    // function gets dates between two dates
    var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=e;d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};

    var daylist = getDaysArray(new Date(start_date),new Date());
    
    // remove today
    daylist.pop();
    return daylist.map((v)=>v.toISOString().slice(0,10))
}
exports.getDatesFromDateToNow = getDatesFromDateToNow

function changeDateStringFormat(date_string, original_format, target_format) {
    const number_string = date_string.replaceAll("/", "").replaceAll("-", "")
    const original_numbers = original_format.replaceAll("/", "").replaceAll("-", "")
    const target_numbers = target_format.replaceAll("/", "").replaceAll("-", "")
    const original_date_array = number_string.split("");
    var target_date_array = [...original_date_array]
    const y_original_index = original_numbers.indexOf("yyyy");
    const y_target_index = target_numbers.indexOf("yyyy");
    console.log(target_date_array)
    for(let i = 0; i < 4; i++) {
        target_date_array[y_target_index + i] = original_date_array[y_original_index + i]
    }
    console.log(target_date_array)

    const m_original_index = original_numbers.indexOf("mm");
    const m_target_index = target_numbers.indexOf("mm");
    for(let i = 0; i < 2; i++) {
        target_date_array[m_target_index + i] = original_date_array[m_original_index + i]
    }

    const d_original_index = original_numbers.indexOf("dd");
    const d_target_index = target_numbers.indexOf("dd");
    for(let i = 0; i < 2; i++) {
        target_date_array[d_target_index + i] = original_date_array[d_original_index + i]
    }
    console.log(target_date_array);
    [...target_format.matchAll(/\//g)].forEach(i => {
        target_date_array.splice(i.index, 0, "/")
    });
    [...target_format.matchAll(/\-/g)].forEach(i => {
        target_date_array.splice(i.index, 0, "-")
    });

    return target_date_array.join('')
}
exports.changeDateStringFormat = changeDateStringFormat