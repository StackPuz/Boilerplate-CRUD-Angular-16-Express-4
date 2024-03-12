import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
  
@Injectable({
  providedIn: 'root'
})
  
export class Util {
  
  history = { current: '', prev: '' }
  constructor(private router: Router) { }
  
  initView(isForm?: Boolean) {
    setTimeout(() => this.initPage(isForm)) //waiting for the next DOM update flush
  }

  initPage(isForm?: Boolean) {
    if (isForm) {
      this.setSearchParams()
      this.maskInput();
      let firstInput = (document.querySelector('form input:not([type=hidden]):not([readonly]), form select:not([readonly])') as HTMLElement)
      if (firstInput) {
        firstInput.focus()
      }
    }
    else {
      this.searchChange()
    }
  }

  maskInput() {
    let win = window as any
    win.Inputmask('datetime', { inputFormat: 'mm/dd/yyyy' }).mask('input[data-type=date]')
    win.Inputmask('datetime', { inputFormat: 'HH:MM:ss' }).mask('input[data-type=time]')
    win.Inputmask('datetime', { inputFormat: 'mm/dd/yyyy HH:MM:ss' }).mask('input[data-type=datetime]')
    win.flatpickr('input[data-type=date]', {
      allowInput: true,
      dateFormat: 'm/d/Y'
    })
    win.flatpickr('input[data-type=time]', {
      allowInput: true,
      enableTime: true,
      enableSeconds: true,
      minuteIncrement: 1,
      noCalendar: true,
      time_24hr: true,
      dateFormat: 'H:i:S'
    })
    win.flatpickr('input[data-type=datetime]', {
      allowInput: true,
      enableTime: true,
      enableSeconds: true,
      minuteIncrement: 1,
      time_24hr: true,
      dateFormat: 'm/d/Y H:i:S'
    })
  }

  unmaskInput() {
    document.querySelectorAll('input[data-type]').forEach(e => {
      (e as any).inputmask.remove();
      (e as any)._flatpickr.destroy()
    })
  }

  setSearchParams() {
    if (location.pathname.toLowerCase().endsWith('create')) {
      new URLSearchParams(location.search).forEach((value, key) => {
        let element = document.getElementById(key) as any || document.getElementById(key + value) as any
        if (element) {
          if (element.tagName == 'INPUT') {
            if (element.type == 'radio') {
              element.click()
              document.querySelectorAll(`[id^="${key}"]`).forEach(e => {
                e.parentElement!.classList.add('readonly')
              })
            }
            else {
              (Object as any).getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, value)
              element.dispatchEvent(new Event('input', { bubbles: true }))
            }
          }
          else {
            element.value = value
            element.dispatchEvent(new Event('change', { bubbles: true }))
          }
          element.setAttribute('readonly', '')
        }
      })
    }
  }

  clearSearch() {
    (document.getElementById('search_word') as HTMLInputElement).value = ''
    let index = location.search.indexOf('?sw=')
    if (index < 0) {
      index = location.search.indexOf('&sw=')
    }
    if (index >= 0) {
      let url = location.pathname + location.search.substr(0, index)
      this.router.navigateByUrl(url)
    }
  }

  search(e: any = null) {
    if (!e || e.keyCode == 13) {
      let searchWord = document.getElementById('search_word') as HTMLInputElement
      let value = searchWord.value
      if (value) {
        let search = `sw=${value}&sc=${ (document.getElementById('search_col') as HTMLSelectElement).value}&so=${ (document.getElementById('search_oper') as HTMLInputElement).value}`
        let query = (!location.search || location.search.substr(0, 4) == '?sw=' ? `?${search}` : `${location.search.split('&sw=')[0]}&${search}`)
        let matches = query.match(/page=\d+/)
        if (matches) {
          query = query.replace(matches[0], 'page=1')
        }
        let url = location.pathname + query
        this.router.navigateByUrl(url)
      }
      else {
        searchWord.focus()
      }
    }
  }

  searchChange() {
    let searchWord = document.getElementById('search_word')
    if (searchWord!.getAttribute('data-type')) {
      this.unmaskInput()
      searchWord!.outerHTML = searchWord!.outerHTML.toString() //remove all mask/datepicker custom event listeners
      searchWord = document.getElementById('search_word')
      searchWord!.addEventListener('keyup', this.search.bind(this))
    }
    let type = ((document.getElementById('search_col') as HTMLSelectElement).selectedOptions[0].getAttribute('data-type') || 'text') as string
    if (type == 'date' || type == 'time' || type == 'datetime') {
      searchWord?.setAttribute('type', 'text')
      searchWord?.setAttribute('data-type', type)
      this.maskInput()
    }
    else {
      searchWord?.setAttribute('type', type)
      searchWord?.removeAttribute('data-type')
    }
    let searchOper = document.getElementById('search_oper') as HTMLSelectElement
    let disabled = (type != 'text')
    searchOper.options[0].disabled = disabled
    if (disabled && searchOper.selectedIndex == 0) {
      searchOper.selectedIndex = 1
    }
    if (document.activeElement?.id == 'search_col') {
      (searchWord as HTMLInputElement)?.select()
    }
  }

  validateForm() {
    let password = document.querySelector('input[type=password]:not([data-match])') as HTMLInputElement
    let match = document.querySelector('[data-match]') as HTMLInputElement
    if (!password.value && (!match || !match.value)) { //do not change password
      return true
    }
    let passwordError = this.validatePassword(password.value)
    let isPasswordMatch = true
    if (match) {
      isPasswordMatch = (document.getElementById(match.getAttribute('data-match')!) as HTMLInputElement).value == match.value
    }
    if (passwordError) {
      alert(passwordError)
    }
    else if (!isPasswordMatch) {
      alert('Password do not match!')
    }
    let isFormValid = (!passwordError && isPasswordMatch)
    return isFormValid
  }

  validatePassword(value: string) {
    let error = ''
    if (!/[a-z]/.test(value)) {
      error += 'Must include lowercase letter\n'
    }
    if (!/[A-Z]/.test(value)) {
      error += 'Must include uppercase letter\n'
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      error += 'Must include symbol\n'
    }
    if (!/[0-9]/.test(value)) {
      error += 'Must include number\n'
    }
    if (value.length < 6 || value.length > 10) {
      error += 'Must have length between 6 and 10'
    }
    if (error) {
      error = 'Password does not meet requirements:\n' + error
    }
    return error
  }

  goto(event: Event) {
    event.preventDefault()
    let url = (event.currentTarget as HTMLElement).getAttribute('href') || (event.currentTarget as HTMLSelectElement).value
    if (url.startsWith('?')) {
      url = window.location.pathname + url
    }
    this.router.navigateByUrl(url)
  }

  goBack(path: string, event?: Event) {
    event?.preventDefault()
    this.router.navigateByUrl(this.getRef(path))
  }

  setHistory() {
    this.history.prev = this.history.current
    this.history.current = location.pathname + location.search
  }
  
  getRef(path: string) {
    let ref = path;
    let query = this.getQuery() as any
    let prev = this.history.prev
    if (query.ref) {
      ref = query.ref
    }
    else if (prev && !query.back) {
      ref = prev
    }
    if (!ref.includes('back=1')) {
      ref += (ref.includes('?') ? '&' : '?') + 'back=1'
    }
    return ref;
  }

  getLink(paging: any, type: string, value: any, sort = '') {
    let query = this.getQuery()
    let link = ''
    if (type == 'sort') {
      link = '?page=' + paging.current + '&size=' + paging.size + '&sort=' + value + ((query.sort == value || (!query.sort && sort == 'asc')) && !query.desc ? '&desc=1' : '')
    }
    else if (type == 'page') {
      link = '?page=' + value + '&size=' + paging.size + (query.sort ? '&sort=' + query.sort + (query.desc ? '&desc=1' : '') : '')
    }
    else if (type == 'size') {
      link = '?page=1&size=' + value + (query.sort ? '&sort=' + query.sort + (query.desc ? '&desc=1' : '') : '')
    }
    link += (query.sw ? '&sw=' + query.sw + '&sc=' + query.sc + '&so=' + query.so : '')
    return link
  }

  getSortClass(column: string, sort = '') {
    let query = this.getQuery()
    return (query.sort == column || (!query.sort && sort) ? (query.sort ? (query.desc ? 'sort desc' : 'sort asc') : `sort ${sort}`) : 'sort')
  }

  getPages(size: number) {
    return [...Array(size + 1).keys()].slice(1)
  }

  getQuery() {
    return Object.fromEntries(new URLSearchParams(location.search) as any) as any
  }

  getFormData(data: any) {
    return Object.keys(data).reduce((form, key) => {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
      return form
    }, new FormData())
  }

  getString(bytes: string) {
    return (bytes ? atob(bytes).replace(/\0/g, '') : bytes)
  }
}