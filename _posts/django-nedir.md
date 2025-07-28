---
title: "Django Nedir? Python Web Framework'ü Hakkında Kapsamlı Rehber"
date: "2024-12-17"
author: "OpenSourceLab"
category: "Açık Kaynak"
tags: ["django", "python", "web framework", "backend", "programlama", "açık kaynak"]
reading_time: "15 dk okuma"
featured: true
excerpt: "Django, Python'un en popüler web framework'lerinden biri. Bu yazıda Django'nun ne olduğunu, özelliklerini, avantajlarını ve nasıl kullanılacağını detaylıca inceliyoruz."
---

# Django Nedir? 🐍

**Django**, Python programlama dili için geliştirilmiş ücretsiz ve açık kaynak bir web framework'üdür. 2005 yılında Lawrence Journal-World gazetesinin web sitesi için geliştirilmiş ve günümüzde dünya çapında milyonlarca geliştirici tarafından kullanılmaktadır.

## 📋 İçindekiler

- [Django'nun Tarihçesi](#djangonun-tarihçesi)
- [Temel Özellikler](#temel-özellikler)
- [Django MVT Mimarisi](#django-mvt-mimarisi)
- [Kurulum ve İlk Proje](#kurulum-ve-ilk-proje)
- [Avantajları ve Dezavantajları](#avantajları-ve-dezavantajları)
- [Popüler Django Projeleri](#popüler-django-projeleri)
- [Öğrenme Kaynakları](#öğrenme-kaynakları)

---

## Django'nun Tarihçesi

> *"Django was invented to meet fast-moving newsroom deadlines, while satisfying the tough requirements of experienced Web developers."* - Django Resmi Sitesi

Django'nun gelişim süreci:

| Yıl | Olay |
|-----|------|
| 2003 | Lawrence Journal-World'de geliştirilmeye başlandı |
| 2005 | Açık kaynak olarak yayınlandı |
| 2008 | Django Software Foundation kuruldu |
| 2012 | Django 1.4 LTS sürümü yayınlandı |
| 2020 | Django 3.2 LTS sürümü yayınlandı |
| 2024 | Django 5.0 sürümü aktif geliştiriliyor |

---

## Temel Özellikler

### 🚀 Hızlı Geliştirme
Django'nun "batteries-included" felsefesi sayesinde web uygulamalarını hızlıca geliştirebilirsiniz.

### 🔒 Güvenlik
Django, güvenlik konusunda çok dikkatli davranır ve birçok güvenlik açığını otomatik olarak önler:

- **CSRF Koruması**: Cross-Site Request Forgery saldırılarına karşı koruma
- **SQL Injection Koruması**: `ORM` kullanarak SQL injection saldırılarını önler
- **XSS Koruması**: Cross-Site Scripting saldırılarına karşı koruma
- **Clickjacking Koruması**: Clickjacking saldırılarına karşı koruma

### 📊 Admin Paneli
Django'nun en güçlü özelliklerinden biri otomatik olarak oluşturulan admin panelidir:

```python
# models.py
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
```

### 🔄 ORM (Object-Relational Mapping)
Django `ORM` sayesinde veritabanı işlemlerini Python kodu ile yapabilirsiniz:

```python
# Veritabanından veri çekme
articles = Article.objects.filter(published_date__year=2024)

# Yeni kayıt oluşturma
new_article = Article.objects.create(
    title="Django Öğreniyorum",
    content="Bu bir test makalesidir."
)
```

---

## Django MVT Mimarisi

Django, **Model-View-Template** (`MVT`) mimarisini kullanır:

### 🗃️ Model (Veri Katmanı)
```python
# models.py
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
```

### 👁️ View (İş Mantığı)
```python
# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .models import User

def user_list(request):
    users = User.objects.all()
    return render(request, 'users/list.html', {'users': users})

def user_detail(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return JsonResponse({
            'username': user.username,
            'email': user.email
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'Kullanıcı bulunamadı'}, status=404)
```

### 🎨 Template (Görünüm Katmanı)
```html
<!-- templates/users/list.html -->
{% extends 'base.html' %}

{% block content %}
<div class="container">
    <h1>Kullanıcı Listesi</h1>
    
    {% if users %}
        <ul class="user-list">
        {% for user in users %}
            <li class="user-item">
                <strong>{{ user.username }}</strong>
                <span class="email">{{ user.email }}</span>
                <small>{{ user.created_at|date:"d/m/Y" }}</small>
            </li>
        {% endfor %}
        </ul>
    {% else %}
        <p>Henüz kullanıcı bulunmuyor.</p>
    {% endif %}
</div>
{% endblock %}
```

---

## Kurulum ve İlk Proje

### 1️⃣ Python Kurulumu
```bash
# Python'un kurulu olduğunu kontrol edin
python --version
# veya
python3 --version
```

Python'un `3.8` veya üzeri sürümünün kurulu olduğundan emin olun.

### 2️⃣ Virtual Environment Oluşturma
```bash
# Virtual environment oluştur
python -m venv django_env

# Virtual environment'ı aktifleştir
# Windows için:
django_env\Scripts\activate

# Linux/Mac için:
source django_env/bin/activate
```

Virtual environment kullanmak, proje bağımlılıklarını izole etmek için önemlidir.

### 3️⃣ Django Kurulumu
```bash
# Django'yu kur
pip install django

# Kurulumu kontrol et
python -m django --version
```

Django'nun en son kararlı sürümü (`5.0`) kurulacaktır.

### 4️⃣ İlk Projeyi Oluşturma
```bash
# Yeni Django projesi oluştur
django-admin startproject myproject

# Proje dizinine git
cd myproject

# Uygulama oluştur
python manage.py startapp blog

# Veritabanını oluştur
python manage.py migrate

# Geliştirme sunucusunu başlat
python manage.py runserver
```

`django-admin` komutu ile yeni proje oluşturabilir, `manage.py` ile proje yönetimi yapabilirsiniz.

### 5️⃣ settings.py Konfigürasyonu
```python
# settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',  # Yeni uygulamamızı ekleyin
]

# Veritabanı ayarları
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Dil ve saat dilimi
LANGUAGE_CODE = 'tr-tr'
TIME_ZONE = 'Europe/Istanbul'
```

Bu ayarlar Türkiye için uygun dil ve saat dilimi konfigürasyonudur.

---

## Avantajları ve Dezavantajları

### ✅ Avantajları

- **Hızlı Geliştirme**: `batteries-included` felsefesi ile hızlı prototipleme
- **Güvenlik**: Yerleşik güvenlik özellikleri (`CSRF`, `XSS`, `SQL Injection` koruması)
- **Admin Paneli**: Otomatik `admin` arayüzü
- **Geniş Ekosistem**: Binlerce üçüncü parti paket (`PyPI`)
- **Dokümantasyon**: Mükemmel dokümantasyon
- **Topluluk**: Büyük ve aktif geliştirici topluluğu
- **Ölçeklenebilirlik**: `Instagram`, `Pinterest` gibi büyük projelerde kullanılıyor

### ❌ Dezavantajları

- **Öğrenme Eğrisi**: `MVT` mimarisi başlangıçta karmaşık gelebilir
- **Monolitik Yapı**: Küçük projeler için fazla olabilir
- **Performans**: Bazı durumlarda `micro-framework`'lerden daha yavaş olabilir
- **Esneklik**: Çok katı yapı kuralları (`convention over configuration`)

---

## Popüler Django Projeleri

### 🌟 Büyük Ölçekli Projeler

1. **Instagram** - Sosyal medya platformu
2. **Pinterest** - Görsel keşif platformu
3. **Mozilla** - Firefox web sitesi
4. **NASA** - Bazı projelerinde Django kullanıyor
5. **Disqus** - Yorum sistemi

### 🛠️ Popüler Django Paketleri

| Paket | Açıklama | GitHub Yıldızı |
|-------|----------|----------------|
| Django REST Framework | API geliştirme | ⭐ 27k+ |
| Django Channels | WebSocket desteği | ⭐ 6k+ |
| Django Crispy Forms | Form stilleri | ⭐ 4k+ |
| Django Debug Toolbar | Geliştirme araçları | ⭐ 8k+ |
| Django Allauth | Kimlik doğrulama | ⭐ 8k+ |

---

## Öğrenme Kaynakları

### 📚 Kitaplar
- **"Django for Beginners"** - William S. Vincent
- **"Two Scoops of Django"** - Daniel Greenfeld & Audrey Roy
- **"Django Design Patterns"** - Arun Ravindran

### 🎥 Video Kurslar
- [Django Official Tutorial](https://docs.djangoproject.com/en/stable/intro/tutorial01/)
- [Django Girls Tutorial](https://tutorial.djangogirls.org/)
- [Real Python Django Tutorials](https://realpython.com/tutorials/django/)

### 🌐 Web Siteleri
- [Django Resmi Dokümantasyonu](https://docs.djangoproject.com/)
- [Django Forum](https://forum.djangoproject.com/)
- [Stack Overflow Django Tag](https://stackoverflow.com/questions/tagged/django)

### 📖 Türkçe Kaynaklar
- [Django Türkiye](https://djangoturkiye.org/)
- [BTK Akademi Django Kursu](https://www.btkakademi.gov.tr/)
- [Patika.dev Django Eğitimi](https://www.patika.dev/)

---

## 🚀 Sonuç

Django, Python web geliştirme dünyasının en güçlü araçlarından biridir. Güvenlik, hız ve esneklik sunan bu framework, hem yeni başlayanlar hem de deneyimli geliştiriciler için mükemmel bir seçimdir.

> **💡 İpucu**: Django öğrenmeye başlamadan önce Python temellerini iyi öğrenin!

~~Eski web framework'ler~~ yerine modern Django kullanın! 🎯

### 💡 Öneriler

1. **Temelleri Öğrenin**: `Python` temellerini iyi öğrenin
2. **Pratik Yapın**: Küçük projelerle başlayın (`blog`, `todo` uygulaması)
3. **Topluluğa Katılın**: Django topluluklarına katılın
4. **Güncel Kalın**: Django'nun yeni özelliklerini takip edin

---

### 📊 Django Kullanım İstatistikleri

| Özellik | Değer |
|---------|-------|
| GitHub Yıldızları | ⭐ 75k+ |
| PyPI İndirme | 📦 50M+ |
| Aktif Geliştirici | 👥 2M+ |
| Topluluk Büyüklüğü | 🌍 190+ Ülke |

---

### 🔗 Faydalı Linkler

- [Django Resmi Sitesi](https://www.djangoproject.com/) 🌐
- [Django GitHub](https://github.com/django/django) 📂
- [Django Packages](https://djangopackages.org/) 📦
- [Django Forum](https://forum.djangoproject.com/) 💬

---

*Bu yazı [OpenSourceLab](https://opensourcelab.org) tarafından hazırlanmıştır. Django hakkında daha fazla bilgi için [resmi dokümantasyonu](https://docs.djangoproject.com/) inceleyebilirsiniz.*

**#Django #Python #WebDevelopment #OpenSource #Backend** 