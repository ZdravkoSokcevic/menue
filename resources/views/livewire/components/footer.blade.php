<footer class="site-footer">
    <div class="footer-container">
        <!-- Company Info & Description -->
        <div class="footer-brand">
            @if(!empty($company['logo']))
                <img 
                    src="/storage/{{ $company['logo'] }}" 
                    alt="{{ $company['name'] ?? 'Company Logo' }}" 
                    class="footer-logo"
                />
            @endif
            
            <h3 class="footer-company-name">{{ $company['name'] ?? 'About Us' }}</h3>
            
            @if(!empty($company['description']))
                <p class="footer-description">{{ $company['description'] }}</p>
            @endif
        </div>

        <!-- Contact Details Grid -->
        <div class="footer-contact-grid">
            @if(!empty($company['phone']))
                <div class="footer-contact-item">
                    <span class="contact-icon">📞</span>
                    <div class="contact-text">
                        <span class="contact-label">Phone</span>
                        <a href="tel:{{ $company['phone'] }}">{{ $company['phone'] }}</a>
                    </div>
                </div>
            @endif

            @if(!empty($company['email']))
                <div class="footer-contact-item">
                    <span class="contact-icon">✉️</span>
                    <div class="contact-text">
                        <span class="contact-label">Email</span>
                        <a href="mailto:{{ $company['email'] }}">{{ $company['email'] }}</a>
                    </div>
                </div>
            @endif

            @if(!empty($company['street']))
                <div class="footer-contact-item">
                    <span class="contact-icon">📍</span>
                    <div class="contact-text">
                        <span class="contact-label">Address</span>
                        <span>{{ $company['street'] }}</span>
                    </div>
                </div>
            @endif

            @if(!empty($company['website']))
                <div class="footer-contact-item">
                    <span class="contact-icon">🌐</span>
                    <div class="contact-text">
                        <span class="contact-label">Website</span>
                        <a href="{{ $company['website'] }}" target="_blank" rel="noopener noreferrer">
                            {{ Str::replace(['https://', 'http://'], '', $company['website']) }}
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; {{ date('Y') }} {{ $company['name'] ?? 'Company' }}. All rights reserved.</p>
    </div>
</footer>