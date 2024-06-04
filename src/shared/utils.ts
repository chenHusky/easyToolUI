import { FormInstance } from 'element-plus';
import { from, Observable, reduce, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { useI18n } from 'vue-i18n';

// TS 对象key合法检查
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return Object.prototype.hasOwnProperty.call(object, key);
}

export function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// 获取时间格式YY-MM-DD
export function formatDate(date: number | string) {
  const time = new Date(date);
  return `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(time.getDate()).padStart(2, '0')}`;
}

/**
 *  校验表单，支持校验单个或多个对象
 * @param formEl 表单对象
 * @param fields 需要校验的表单项key
 */

export function formValidator(
  formEl: FormInstance | undefined,
  fields?: string[] | string
) {
  if (!formEl) return of(false);
  if (!fields) {
    return validate(formEl);
  } else if (Array.isArray(fields)) {
    const ob = from(fields);
    return ob.pipe(
      mergeMap((item) => validate(formEl, item)),
      reduce((pre, next) => pre && next)
    );
  } else if (typeof fields === 'string') {
    return validate(formEl, fields);
  }
  return of(false);
}

export function validate(formEl: FormInstance | undefined, field?: string) {
  return new Observable((observer) => {
    if (!formEl) {
      observer.next(false);
      observer.complete();
      return;
    }
    if (field) {
      formEl.validateField(field, (valid) => {
        observer.next(valid);
        observer.complete();
      });
    } else {
      formEl.validate((valid) => {
        observer.next(valid);
        observer.complete();
      });
    }
  });
}

// 手动触发校验
export function doValidatorForm(
  formEl: FormInstance | undefined,
  field?: string
) {
  validate(formEl, field).subscribe();
}

/**
 *  解决异步校验时，blur与按钮手动触发校验冲突，优先按钮触发
 * @param formEl 表单对象
 * @param field 需要校验的表单项key
 */
export function asyncBlur(formEl: FormInstance | undefined, field: string) {
  setTimeout(() => {
    formValidator(formEl, field).subscribe();
  }, 200);
}

export function getLastTime(time: number) {
  const { t } = useI18n();
  let dValue = time || 0;

  if (dValue / 60 < 1) {
    return `${Math.ceil(dValue)}${t('software.SECONDS_AGO')}`;
  }
  dValue = Math.floor(dValue / 60);
  if (dValue / 60 < 1) {
    return `${dValue}${t('software.MINUTE_AGO')}`;
  }
  dValue = Math.floor(dValue / 60);
  if (dValue / 24 < 1) {
    return `${dValue}${t('software.HOURS_AGO')}`;
  }
  dValue = Math.floor(dValue / 24);
  if (dValue / 365 < 1) {
    return `${dValue}${t('software.DAYS_AGO')}`;
  }
  dValue = Math.floor(dValue / 365);
  return `${dValue}${t('software.YEARS_AGO')}`;
}
