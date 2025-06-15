import disposable from "disposable-email-domains"

export function isDisposableEmail(email:string) {
    const domain = email.split("@")[1].toLowerCase();
    return disposable.includes(domain);
  }