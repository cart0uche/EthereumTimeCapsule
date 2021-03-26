import pytest
from brownie import accounts, chain


@pytest.fixture
def contract(TimeCapsule):
	return accounts[0].deploy(TimeCapsule)


def test_check_initial_time_capsule(contract):
	capsules = contract.getCapsules({'from': accounts[0]})
	assert 0 == len(capsules)


def test_check_add_capsules_in_futur(contract):
	message = "Hello World :)"
	time_futur = chain.time()+5

	# add a message in time+1
	contract.sendCapsule(message, time_futur,  {'from': accounts[0]})

	# at chain.time() we get one capsule but it's an empty capsule
	capsules = contract.getCapsules({'from': accounts[0]})
	assert 1 == len(capsules)
	assert (accounts[0], '', time_futur, False) == capsules[0]

	# at chain.time()+5 we get one capsule
	chain.mine(timedelta=5)
	capsules = contract.getCapsules({'from': accounts[0]})
	assert 1 == len(capsules)
	assert (accounts[0], message, time_futur, True) == capsules[0]


def test_check_add_3_capsules_in_futur(contract):
	message1 = "Hello World :) 1"
	time_futur1 = chain.time() + 50

	message2 = "Hello World :) 2"
	time_futur2 = chain.time() + 100

	message3 = "Hello World :) 3"
	time_futur3 = chain.time() + 5

	# add a capsules
	contract.sendCapsule(message1, time_futur1, {'from': accounts[0]})
	contract.sendCapsule(message2, time_futur2, {'from': accounts[0]})
	contract.sendCapsule(message3, time_futur3, {'from': accounts[0]})

	# get capsule 3
	chain.mine(timedelta=5)
	capsules = contract.getCapsules({'from': accounts[0]})
	assert 3 == len(capsules)
	assert (accounts[0], ''      , time_futur1, False) == capsules[0]
	assert (accounts[0], ''      , time_futur2, False) == capsules[1]
	assert (accounts[0], message3, time_futur3, True ) == capsules[2]

	# get capsule 3 and 1
	chain.mine(timedelta=45)
	capsules = contract.getCapsules({'from': accounts[0]})
	assert 3 == len(capsules)
	assert (accounts[0], message1, time_futur1, True ) == capsules[0]
	assert (accounts[0], ''      , time_futur2, False) == capsules[1]
	assert (accounts[0], message3, time_futur3, True ) == capsules[2]

	# get all capsules
	chain.mine(timedelta=50)
	capsules = contract.getCapsules({'from': accounts[0]})
	assert 3 == len(capsules)
	assert (accounts[0], message1, time_futur1, True) == capsules[0]
	assert (accounts[0], message2, time_futur2, True) == capsules[1]
	assert (accounts[0], message3, time_futur3, True) == capsules[2]
	