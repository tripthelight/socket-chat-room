const isValidate = (form) => {
  var obj;
  var dispName;
  var dataType;
  var minValue;
  var maxValue;
  var minSize;
  var maxSize;
  var isValid;
  var value;
  for (i = 0; i < form.elements.length; i++) {

      obj = form.elements(i);
      
      if(obj.type != "grid") {
          
          if(obj.type == "") break;
          obj.value = trim(obj.value);
          dispName = obj.getAttribute("dispName");
          dataType = obj.getAttribute("dataType");
          minValue = obj.getAttribute("minValue");
          maxValue = obj.getAttribute("maxValue");
          minSize  = obj.getAttribute("minSize");
          maxSize  = obj.getAttribute("maxSize");
          len = obj.getAttribute("len");
          hLen = obj.getAttribute("hLen");
          value = obj.value;
  
          if (dispName == null) {
              dispName = obj.name;
          }
          // 필수 입력 항목 체크
          if (obj.getAttribute("notNull") != null) {

              isValid = false;
  
              if (obj.type == "radio" || obj.type == "checkbox") {
                  if (form.elements(obj.name).length) {
                      for (j = 0; j < form.elements(obj.name).length; j++) {
                          if (form.elements(obj.name)[j].checked) {
                              isValid = true;
                              break;
                          }
                      }
                  } else {
                      if (obj.checked) {
                          isValid = true;
                      }
                  }
              } else {
                  if (value != "") {
                      isValid = true;
                  } else {
                      if (obj.getAttribute("comma") != null) {
                          obj.value = 0;
                          isValid = true;
                      }
                  }
              }
  
              if (!isValid) {
                  alert(dispName + "을(를) 입력하십시오.");
                  obj.focus();
                  if (window.event) {
                      window.event.returnValue = false;
                  }
                  return  false;
              }
          }
  
          // 데이터 길이 체크
          if (len != null) {
              if (value.length != eval(len)) {
                  alert(dispName + "은(는) " + len + "자리를 입력해야 합니다.");
                  obj.focus();
                  obj.value = obj.value;
                  if (window.event) {
                      window.event.returnValue = false;
                  }
                  return  false;
              }
          }

          // 데이터 최소길이, 최대길이 체크
          if (minSize != null) {
              if (eval(minSize) > eval(value.length)) {
                  alert(dispName + " 입력값의 길이는 최소(" + minSize + ") 이상입니다.");
                  obj.focus();
                  obj.value = obj.value;
                  if (window.event) {
                      window.event.returnValue = false;
                  }
                  return  false;
              }
          }

          if (maxSize != null) {
              if (eval(maxSize) < eval(value.length)) {
                  alert(dispName + " 입력값의 길이가 최대(" + maxSize + ")을 초과합니다.");
                  obj.focus();
                  obj.value = obj.value;
                  if (window.event) {
                      window.event.returnValue = false;
                  }
                  return  false;
              }
          }
          
  
          if (obj.type == "text") {
              // 데이터 타입 체크
              if (dataType == null) {
                  mLen = obj.maxLength;
                  if (hLen != null) mLen = hLen * 2;
                  if (obj.readOnly == false && jsByteLength(value) > mLen) {
                      alert(dispName + " 길이가 " + mLen + " 을(를) 넘습니다.");
                      obj.focus();
                      if (window.event) {
                          window.event.returnValue = false;
                      }
  
                      return  false;
                  }
              } else if ((value != "") && (dataType != null)) {
                  isValid = true;
                  checkValue = false;
  
                  if (dataType == "date") {
                      value = deleteDateFormatStr(value);
                      isValid = isDate(value);
                      checkValue = true;
                  } else if (dataType == "email") {
                      isValid = isEmail(value);
                  } else if (dataType == "float") {
                      value = deleteCommaStr(value);
                      isValid = isFloat(value);
                      checkValue = true;
                  } else if (dataType == "integer") {
                      value = deleteCommaStr(value);
                      isValid = isInteger(value);
                      checkValue = true;
                  } else if (dataType == "number") {
                      value = deleteCommaStr(value);
                      isValid = isNumber(value);
                      checkValue = true;
                  } else if (dataType == "double") {
                      value = deleteCommaStr(value);
                      isValid = isNumber(value);
                      checkValue = true;
                  }
  
                  if (!isValid) {
                      alert(dispName + " 형식이 올바르지 않습니다.");
                      if (dataType == "float" || dataType == "integer" || dataType == "number" || dataType == "double") {
                          obj.value = "0";
                      }
                      obj.focus();
                      if (window.event) {
                          window.event.returnValue = false;
                      }
                      return  false;
                  }

                  if (checkValue) {
                      if (minValue != null) {
                          if (eval(minValue) > eval(value)) {
                              alert(dispName + " 값은 최소값(" + minValue + ") 이상입니다.");
                              obj.focus();
                              if (window.event) {
                                  window.event.returnValue = false;
                              }
                              return  false;
                          }
                      }
  
                      if (isValid && (maxValue != null)) {
                          if (eval(maxValue) < eval(value)) {
                              alert(dispName + " 값이 최대값(" + maxValue + ")을 초과합니다.");
                              obj.focus();
                              if (window.event) {
                                  window.event.returnValue = false;
                              }
                              return  false;
                          }
                      }
                  }
              }
          }
      }
  }

  return  true;
}

module.exports = {isValidate};