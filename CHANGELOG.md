## 1.1.0 (2025-12-25)

* chore:  add markdown lint (#174) ([0d3825e](https://github.com/rodmax/factory-t/commit/0d3825e)), closes [#174](https://github.com/rodmax/factory-t/issues/174)
* chore: add types check in ci and rearrange package scripts (#183) ([f88c4b0](https://github.com/rodmax/factory-t/commit/f88c4b0)), closes [#183](https://github.com/rodmax/factory-t/issues/183)
* chore: change master to main in all places (#160) ([1d63946](https://github.com/rodmax/factory-t/commit/1d63946)), closes [#160](https://github.com/rodmax/factory-t/issues/160)
* chore: fix sonarqube issues (#177) ([579e664](https://github.com/rodmax/factory-t/commit/579e664)), closes [#177](https://github.com/rodmax/factory-t/issues/177)
* chore: fix SonarQube settings remove other code quality badges (#175) ([9894cc3](https://github.com/rodmax/factory-t/commit/9894cc3)), closes [#175](https://github.com/rodmax/factory-t/issues/175)
* chore: fix test command in pre-version.sh script ([b5104b5](https://github.com/rodmax/factory-t/commit/b5104b5))
* chore: remove .vscode/settings.json from git control ([2b66303](https://github.com/rodmax/factory-t/commit/2b66303))
* chore: update badge with github status (#204) ([8e2fde6](https://github.com/rodmax/factory-t/commit/8e2fde6)), closes [#204](https://github.com/rodmax/factory-t/issues/204)
* chore: use SHA for sonarqube scan action (#192) ([96de04d](https://github.com/rodmax/factory-t/commit/96de04d)), closes [#192](https://github.com/rodmax/factory-t/issues/192)
* chore(sonarqube): send metadata to sonarqube via ci (#159) ([b592e15](https://github.com/rodmax/factory-t/commit/b592e15)), closes [#159](https://github.com/rodmax/factory-t/issues/159)
* feat: add mandatory default options (#162) ([1b40aac](https://github.com/rodmax/factory-t/commit/1b40aac)), closes [#162](https://github.com/rodmax/factory-t/issues/162)
* docs: add sonarqube badge ([0d6a9b8](https://github.com/rodmax/factory-t/commit/0d6a9b8))



## 1.0.0 (2025-04-07)

* docs: add "publish new version" section ([1b0fcf4](https://github.com/rodmax/factory-t/commit/1b0fcf4))
* chore: change logo ([a39824d](https://github.com/rodmax/factory-t/commit/a39824d))
* chore: fix config.commitizen.path value in package.json ([e9749fc](https://github.com/rodmax/factory-t/commit/e9749fc))
* chore: fix(force) audit issues ([3c1c706](https://github.com/rodmax/factory-t/commit/3c1c706))
* chore: update all dev dependencies (#132) ([624798b](https://github.com/rodmax/factory-t/commit/624798b)), closes [#132](https://github.com/rodmax/factory-t/issues/132)
* chore: update deps (#139) ([8cc1709](https://github.com/rodmax/factory-t/commit/8cc1709)), closes [#139](https://github.com/rodmax/factory-t/issues/139)
* chore(deps): update dev dependencies (#116) ([eaa2d72](https://github.com/rodmax/factory-t/commit/eaa2d72)), closes [#116](https://github.com/rodmax/factory-t/issues/116)
* chore(deps): upgrade to typescript 4+, nodejs 18+ ([541509a](https://github.com/rodmax/factory-t/commit/541509a))
* ci: revert send coverage to sonar (#129) ([09b263d](https://github.com/rodmax/factory-t/commit/09b263d)), closes [#129](https://github.com/rodmax/factory-t/issues/129)
* ci(renovate): fix ignorePaths value ([416da30](https://github.com/rodmax/factory-t/commit/416da30)), closes [#95](https://github.com/rodmax/factory-t/issues/95)
* ci(renovate): remove redundant config file ([861a65f](https://github.com/rodmax/factory-t/commit/861a65f))
* ci(sonarcloud): enable check using actions (#128) ([d085697](https://github.com/rodmax/factory-t/commit/d085697)), closes [#128](https://github.com/rodmax/factory-t/issues/128)


### BREAKING CHANGE

* all clients need version of typescipt >=4.7.4 and nodejs >= 18 lts

* ci: update ci matrix to [18.x, 20.x]


## [0.3.1](https://github.com/rodmax/factory-t/compare/0.3.0...0.3.1) (2021-09-17)


### Bug Fixes

* handle optional field values when no field factory passed ([#111](https://github.com/rodmax/factory-t/issues/111)) ([b64dc49](https://github.com/rodmax/factory-t/commit/b64dc490ddf2e82f657cc639adf84e11a25cab26))



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



