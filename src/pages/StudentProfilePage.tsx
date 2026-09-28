{/* زر تسجيل الخروج الفعّال */}
<PillButton 
  variant="red" 
  className="w-full mt-2" 
  onClick={() => {
    // مسح أي بيانات تخص المستخدم أو الجلسة من التخزين المحلي
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    // إذا كانت الدالة الأصلية موجودة نستدعيها احتياطاً
    if (logout) {
      try { logout(); } catch (e) { /* ignore */ }
    }
    
    // إعادة توجيه المستخدم للصفحة الرئيسية أو صفحة تسجيل الدخول
    navigate({ name: 'home' });
    
    // إعادة تحميل الصفحة لضمان مسح كافة الحالات المخزنة في الذاكرة
    window.location.reload();
  }}
>
  <LogOut size={16} /> Log Out
</PillButton>