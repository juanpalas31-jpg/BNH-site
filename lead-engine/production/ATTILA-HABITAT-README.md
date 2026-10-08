# Attila Habitat — La Ruche
Spider Engine private family real estate research module. Independent of Bilan Habitat leads and financial-market portfolio.
- GET /api/attila-habitat returns module DNA and commands.
- POST /api/attila-habitat: {action:"nest",preferences:{city:"Toulouse"}} specifies a family home, private office, and separate rental units.
- POST {action:"scout",listing:{id,source,url,location,price,surfaceM2,units}} checks candidate completeness. Listings are user-provided; no portal is connected.
- POST {action:"evaluate",property:{askingPrice,acquisitionCosts,renovationBudget,annualRent,annualPropertyTax,annualInsurance,annualMaintenance,annualOtherCosts,vacancyRate,managementRate,annualDebtService,checks:{...}}} estimates annual cash flow before income tax.
- All API operations require a server-side ATTILA_FAMILY_API_KEY (32+ chars); deny by default.
- No automatic listing scraping, data resale, real estate brokerage, tenant data processing, bidding, purchase, payments or loans.
- Before operating: validate local property rights, energy performance, tax rules, privacy, insurance, planning permits, landlord obligations and financing with qualified professionals.
- A private office must be lawful and compliant with building and tenant safety rules. Tenants need not know proprietary software details, but legally required information must be disclosed.
- Real estate lead resale needs legal review of authorization, consent and data-protection requirements.
