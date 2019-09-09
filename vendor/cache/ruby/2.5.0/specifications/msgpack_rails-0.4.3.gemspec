# -*- encoding: utf-8 -*-
# stub: msgpack_rails 0.4.3 ruby lib

Gem::Specification.new do |s|
  s.name = "msgpack_rails".freeze
  s.version = "0.4.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Jingwen Owen Ou".freeze]
  s.date = "2018-09-04"
  s.description = "Message Pack for Rails.".freeze
  s.email = ["jingweno@gmail.com".freeze]
  s.homepage = "https://github.com/jingweno/msgpack_rails".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.7.6".freeze
  s.summary = "The Rails way to serialize/deserialize with Message Pack.".freeze

  s.installed_by_version = "2.7.6" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<activesupport>.freeze, [">= 3.0"])
      s.add_runtime_dependency(%q<msgpack>.freeze, [">= 0"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.3.1"])
      s.add_development_dependency(%q<minitest>.freeze, ["~> 5.3.3"])
      s.add_development_dependency(%q<rails>.freeze, [">= 4.1.0"])
    else
      s.add_dependency(%q<activesupport>.freeze, [">= 3.0"])
      s.add_dependency(%q<msgpack>.freeze, [">= 0"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.3.1"])
      s.add_dependency(%q<minitest>.freeze, ["~> 5.3.3"])
      s.add_dependency(%q<rails>.freeze, [">= 4.1.0"])
    end
  else
    s.add_dependency(%q<activesupport>.freeze, [">= 3.0"])
    s.add_dependency(%q<msgpack>.freeze, [">= 0"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.3.1"])
    s.add_dependency(%q<minitest>.freeze, ["~> 5.3.3"])
    s.add_dependency(%q<rails>.freeze, [">= 4.1.0"])
  end
end
