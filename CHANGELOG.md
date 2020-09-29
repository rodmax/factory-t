# [0.3.0](https://github.com/rodmax/factory-t/compare/0.3.0-beta.1...0.3.0) (2020-09-29)



# [0.3.0-beta.1](https://github.com/rodmax/factory-t/compare/0.3.0-beta.0...0.3.0-beta.1) (2020-09-29)


### Bug Fixes

* **deps:** update dependency eslint-plugin-jest to v23.13.1 ([#61](https://github.com/rodmax/factory-t/issues/61)) ([87e485d](https://github.com/rodmax/factory-t/commit/87e485d0a8d1488dd59465ee603cac6738216365))
* **deps:** update dependency eslint-plugin-jest to v23.13.2 ([488605c](https://github.com/rodmax/factory-t/commit/488605ce78fb0814ef1279b97fda5cb741853d6c))


### Code Refactoring

* rename some public names ([7020da3](https://github.com/rodmax/factory-t/commit/7020da3fc17e808a36e2bcabfab86fa14bac8850))


### Features

* add optionalField(), sequencesField() field factory helpers ([589e40e](https://github.com/rodmax/factory-t/commit/589e40e4ec18e4de5f46e0ca6b15938f0da83d4e))


### BREAKING CHANGES

* too many small things rewritten, see tutorial



<a name="0.3.0-beta.0"></a>
# [0.3.0-beta.0](https://github.com/rodmax/factory-t/compare/0.2.1...0.3.0-beta.0) (2020-05-18)


### Features

* **all:** public API of factory creation/configuration fully reworked ([9c19aa3](https://github.com/rodmax/factory-t/commit/9c19aa3)), closes [#34](https://github.com/rodmax/factory-t/issues/34)
* rework lib so to split factory builder and using logic ([2eff03b](https://github.com/rodmax/factory-t/commit/2eff03b))


### BREAKING CHANGES

* Public API shape fully reworked. please see README and tests to usage details, in
general migration should not be a difficult
* **all:** You should refactor all creation code of your factroies



<a name="0.2.1"></a>
## [0.2.1](https://github.com/rodmax/factory-t/compare/0.2.0...0.2.1) (2019-09-19)


### Bug Fixes

* **buildlist:** allow "count" param to be 0 ([f14e9be](https://github.com/rodmax/factory-t/commit/f14e9be)), closes [#19](https://github.com/rodmax/factory-t/issues/19)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/rodmax/factory-t/compare/0.1.5...0.2.0) (2019-08-23)


### Features

* add custom "options" to build* methods ([f6f48ea](https://github.com/rodmax/factory-t/commit/f6f48ea))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/rodmax/factory-t/compare/0.1.4...0.1.5) (2019-06-24)


### Bug Fixes

* allow to use readonly arrays with "makeSequence()" ([2bdccf1](https://github.com/rodmax/factory-t/commit/2bdccf1))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/rodmax/factory-t/compare/0.1.3...0.1.4) (2019-04-25)


### Bug Fixes

* allow to provide nested object/array directly ([a2779b2](https://github.com/rodmax/factory-t/commit/a2779b2)), closes [#10](https://github.com/rodmax/factory-t/issues/10)



<a name="0.1.3"></a>
## [0.1.3](https://github.com/rodmax/factory-t/compare/0.1.2...0.1.3) (2019-04-16)

Internal release(no changes in library): update README and package.json

<a name="0.1.2"></a>
## [0.1.2](https://github.com/rodmax/factory-t/compare/0.1.1...0.1.2) (2019-04-14)

Internal release(no changes in library): fix bump version scripts build version "0.1.1"

<a name="0.1.1"></a>
## [0.1.1](https://github.com/rodmax/factory-t/compare/bbf51ba...0.1.1) (2019-04-02)


### Bug Fixes

* fix gramma in  "*Sequence" helper names ([daacf75](https://github.com/rodmax/factory-t/commit/daacf75)), closes [#4](https://github.com/rodmax/factory-t/issues/4)
* recognize array as propery value ([3f0f34b](https://github.com/rodmax/factory-t/commit/3f0f34b))
* recognize null as property value ([1f0c2e6](https://github.com/rodmax/factory-t/commit/1f0c2e6))


### Features

* add initial version of the library ([bbf51ba](https://github.com/rodmax/factory-t/commit/bbf51ba))
* add makeSequense() makeSequenseFromEnum() helper functions ([4d37e67](https://github.com/rodmax/factory-t/commit/4d37e67))
* add resetCount() method ([bfb45aa](https://github.com/rodmax/factory-t/commit/bfb45aa))


### BREAKING CHANGES

* makeSequenseFromEnum -> makeSequenceFromEnum, makeSequense -> makeSequence



